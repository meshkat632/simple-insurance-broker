resource "null_resource" "setup-local-kubectl" {
  provisioner "local-exec" {
    command = "echo $FOO $BAR $BAZ >> env_vars.txt"

    environment = {
      FOO = "bar"
      BAR = 1
      BAZ = "true"
    }
  }

  depends_on = [
    aws_eks_cluster.demo
  ]
}

