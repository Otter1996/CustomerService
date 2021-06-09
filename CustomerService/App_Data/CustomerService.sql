
/*建立CusyomerService資料表*/
CREATE TABLE [dbo].[CustomerService]
(
	[ConversationId] INT NOT NULL PRIMARY KEY, 
    [RequestId] NVARCHAR(50) NULL, 
    [SendTime] DATETIME NULL, 
    [Context] NVARCHAR(MAX) NULL, 
    [ResponseId] NVARCHAR(50) NULL, 
    [Read] BIT NULL
)
