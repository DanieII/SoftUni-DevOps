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
  name     = "TaskBoardRG${random_integer.random_integer.result}"
  location = "West Europe"
}

resource "azurerm_service_plan" "service_plan" {
  name                = "taskboard-${random_integer.random_integer.result}"
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
      dotnet_version = "6.0"
    }
    always_on = false
  }

  connection_string {
    name  = "DefaultConnection"
    type  = "SQLAzure"
    value = "Data Source=tcp:${azurerm_mssql_server.mssql_server.fully_qualified_domain_name},1433;Initial Catalog=${azurerm_mssql_database.mssql_database.name};User ID=${azurerm_mssql_server.mssql_server.administrator_login};Password=${azurerm_mssql_server.mssql_server.administrator_login_password};Trusted_Connection=False; MultipleActiveResultSets=True;"
  }
}

resource "azurerm_app_service_source_control" "source" {
  app_id                 = azurerm_linux_web_app.web_app.id
  repo_url               = "https://github.com/DanieII/TaskBoard-DevOps"
  branch                 = "main"
  use_manual_integration = true
}

resource "azurerm_mssql_server" "mssql_server" {
  name                         = "db-server-${random_integer.random_integer.result}"
  resource_group_name          = azurerm_resource_group.resource_group.name
  location                     = azurerm_resource_group.resource_group.location
  version                      = "12.0"
  administrator_login          = "adminadmin"
  administrator_login_password = "serverPass11"
  minimum_tls_version          = "1.2"
}

resource "azurerm_mssql_database" "mssql_database" {
  name           = "db"
  server_id      = azurerm_mssql_server.mssql_server.id
  collation      = "SQL_Latin1_General_CP1_CI_AS"
  license_type   = "LicenseIncluded"
  sku_name       = "S0"
  zone_redundant = false
}

resource "azurerm_mssql_firewall_rule" "firewall" {
  name             = "FirewallRule1"
  server_id        = azurerm_mssql_server.mssql_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

