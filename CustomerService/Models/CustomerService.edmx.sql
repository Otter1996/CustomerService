
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 06/06/2021 22:53:53
-- Generated from EDMX file: C:\SlnCustomerService\CustomerService\CustomerService\Models\CustomerService.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [CustomerService];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------


-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[CustomerService]', 'U') IS NOT NULL
    DROP TABLE [dbo].[CustomerService];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'CustomerService'
CREATE TABLE [dbo].[CustomerService] (
    [ConversationId] int  NOT NULL,
    [RequestId] nvarchar(50)  NULL,
    [SendTime] datetime  NULL,
    [Context] nvarchar(max)  NULL,
    [ResponseId] nvarchar(50)  NULL,
    [Read] bit  NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [ConversationId] in table 'CustomerService'
ALTER TABLE [dbo].[CustomerService]
ADD CONSTRAINT [PK_CustomerService]
    PRIMARY KEY CLUSTERED ([ConversationId] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------