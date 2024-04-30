#version 330

uniform vec4 u_color;
uniform vec3 u_cam_pos;
uniform vec3 u_light_pos;
uniform vec3 u_light_intensity;

in vec4 v_position;
in vec4 v_normal;
in vec2 v_uv;

out vec4 out_color;

void main() {
  // YOUR CODE HERE
  // Ambient
  float ambient_coeff = 0.1;
  vec3 ambient_illum = vec3(0, 0, 0);

  vec4 ambient = vec4(ambient_coeff * ambient_illum, 1);

 // Diffuse
  vec4 diffuse_coeff = vec4(0.5, 0, 0, 1);

  float distance_squared = pow(v_position.x - u_light_pos.x, 2) + pow(v_position.y - u_light_pos.y, 2) + pow(v_position.z - u_light_pos.z, 2);
  vec3 illum = u_light_intensity / distance_squared;
  vec3 difference = vec3(u_light_pos.x - v_position.x, u_light_pos.y - v_position.y, u_light_pos.z - v_position.z);
  float max_thing = max(0.0, dot(normalize(v_normal), vec4(normalize(difference), 1)));
  vec4 diffuse = diffuse_coeff * vec4(illum * max_thing, 1);

  // Specular
  vec4 specular_coeff = vec4(0.75, 0, 0, 1);

  distance_squared = pow(v_position.x - u_light_pos.x, 2) + pow(v_position.y - u_light_pos.y, 2) + pow(v_position.z - u_light_pos.z, 2);
  illum = u_light_intensity / distance_squared;
  vec3 l_vector = vec3(u_light_pos.x - v_position.x, u_light_pos.y - v_position.y, u_light_pos.z - v_position.z);
  vec3 cam_vector = vec3(u_cam_pos.x - v_position.x, u_cam_pos.y - v_position.y, u_cam_pos.z - v_position.z);

  vec3 bisector = (l_vector + cam_vector) / length(l_vector + cam_vector);
  float p = 1/0.15;
  max_thing = pow(max(0.0, dot(normalize(v_normal), vec4(normalize(bisector), 1))), p);
  vec4 specular = specular_coeff * vec4(illum * max_thing, 1);
  
  // (Placeholder code. You will want to replace it.)
  out_color = ambient + diffuse + specular;
  out_color.a = 1;
}
