DELIMITER $$
    CREATE DEFINER=`root`@`localhost` PROCEDURE `users_getAll`()
    
    BEGIN
        
        select * from  users ;
    
    END$$
    DELIMITER ;
    
    