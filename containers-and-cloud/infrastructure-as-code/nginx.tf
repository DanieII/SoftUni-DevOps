terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

resource "docker_image" "nginx" {
  name = "nginxdemos/hello"
}

resource "docker_container" "nginx" {
  image = resource.docker_image.nginx.name
  name  = "nginx"

  ports {
    internal = 80
    external = 80
  }
}
