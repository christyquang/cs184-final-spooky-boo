#include <nanogui/nanogui.h>

#include "../clothMesh.h"
#include "../misc/sphere_drawing.h"
#include "sphere.h"

using namespace nanogui;
using namespace CGL;

void Sphere::collide(PointMass &pm) {
  // TODO (Part 3): Handle collisions with spheres.
  Vector3D direction = pm.position - this->origin;
  
  // First attempt
  // if (direction.norm() <= radius) {
  //   Vector3D tangent_point = origin + direction.unit() * radius;
  //   Vector3D correction = tangent_point - pm.last_position;
  //   pm.position = pm.last_position + (1-friction) * correction;
  // }

  // Slightly altered order --> more folds
  if (direction.norm() <= this->radius) {
		Vector3D tangent_point = direction.unit()* this->radius;
		Vector3D correction = this->origin + tangent_point;
		pm.position = pm.last_position + (1 - this->friction) * (correction - pm.position);
	}
}

void Sphere::render(GLShader &shader) {
  // We decrease the radius here so flat triangles don't behave strangely
  // and intersect with the sphere when rendered
  m_sphere_mesh.draw_sphere(shader, origin, radius * 0.92);
}
