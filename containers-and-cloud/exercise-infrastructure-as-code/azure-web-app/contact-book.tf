terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.0.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "random_integer" "random_integer" {
  min = 10000
  max = 99999
}

resource "azurerm_resource_group" "resource_group" {
  name     = "ContactBookRG${random_integer.random_integer.result}"
  location = "West Europe"
}

resource "azurerm_service_plan" "service_plan" {
  name                = "contact-book-${random_integer.random_integer.result}"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = azurerm_resource_group.resource_group.location
  os_type             = "Linux"
  sku_name            = "F1"
}

resource "azurerm_linux_web_app" "web_app" {
  name                = azurerm_service_plan.service_plan.name
  resource_group_name = azurerm_service_plan.service_plan.resource_group_name
  location            = azurerm_service_plan.service_plan.location
  service_plan_id     = azurerm_service_plan.service_plan.id

  site_config {
    application_stack {
      node_version = "16-lts"
    }
    always_on = false
  }
}

resource "azurerm_app_service_source_control" "source" {
  app_id                 = azurerm_linux_web_app.web_app.id
  repo_url               = "https://github.com/nakov/ContactBook"
  branch                 = "master"
  use_manual_integration = true
}
