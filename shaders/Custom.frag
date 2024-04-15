#version 330

// (Every uniform is available here.)

uniform mat4 u_view_projection;
uniform mat4 u_model;

uniform float u_normal_scaling;
uniform float u_height_scaling;

uniform vec3 u_cam_pos;
uniform vec3 u_light_pos;
uniform vec3 u_light_intensity;

// Feel free to add your own textures. If you need more than 4,
// you will need to modify the skeleton.
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_3;
uniform sampler2D u_texture_4;

uniform vec2 u_texture_4_size;

// Environment map! Take a look at GLSL documentation to see how to
// sample from this.
uniform samplerCube u_texture_cubemap;


in vec4 v_position;
in vec4 v_normal;
in vec4 v_tangent;
in vec2 v_uv;

out vec4 out_color;

float h(vec2 uv) {
  // You may want to use this helper function...
  float height;
  height = texture(u_texture_4, uv).r;
  return height;
}

void main() {
  // Your awesome shader here!
  // out_color = (vec4(1, 1, 1, 0) + v_normal) / 2;
  // out_color.a = 1;

  const float backscatter = 0.25;
  const float edginess = 8.0;
  vec3 sheen = vec3(0.5, 0.5, 0.5); // sheen is color of highlight --> change to fog?
  const float roughness = 0.15;

  //bump
  mat3 tbn;
  tbn[0] = normalize(v_tangent.xyz);
  tbn[1] = normalize(cross(v_normal.xyz, v_tangent.xyz));
  tbn[2] = normalize(v_normal.xyz);

  float u = v_uv.x;
  float v = v_uv.y;
  float w = u_texture_4_size.x;
  float ht = u_texture_4_size.y;

  float dU = (h(vec2(u+1.0/w, v)) - h(v_uv)) * u_height_scaling * u_normal_scaling;
  float dV = (h(vec2(u, v+1.0/ht)) - h(v_uv)) * u_height_scaling * u_normal_scaling;
  vec3 n0 = vec3(-dU, -dV, 1.0);
  vec3 nd = tbn * n0;

  // Blinn Phong shading
  vec3 n = normalize(nd);
  vec3 u_light_dir = normalize(u_light_pos - v_position.xyz);
  vec3 u_out_dir = normalize(u_cam_pos - v_position.xyz);

  // =====

  float distance_squared = pow(v_position.x - u_light_pos.x, 2) + pow(v_position.y - u_light_pos.y, 2) + pow(v_position.z - u_light_pos.z, 2);
  vec3 illum = u_light_intensity / distance_squared;

  vec3 ka = vec3(1, 1, 1); // color of ambient (white)
  vec3 kd = vec3(1, 1, 1); // color of diffuse
  float ks = 0.6;

  // diffuse
  float dotval = dot(n, u_light_dir);
  float maxval = max(0.0, dotval);

  vec3 diffuse = kd * maxval * normalize(u_light_intensity);

  // =====

  float p = 1/roughness;
  vec3 shiny = sheen * pow(maxval, p) * backscatter * illum; //analyze this

  // illumination: sheen * backscatter (backscatter is from other pts)
  // backscatter is over light to cam

  float cosine = max(dot(n, u_out_dir), 0.0);
  float sine = sqrt(1.0 - cosine);
  p = edginess; // increasing p makes specular highlight smaller and harsher
  shiny = shiny + sheen * pow(sine, p) * diffuse;
  // p == edginess here --> determines how sharp the highlights are going to be
  // illumination is sheen * diffuse
  // edginess is only from the visible part

  out_color = vec4((ka * illum) + (kd*diffuse) + (ks*shiny), 1);
}
