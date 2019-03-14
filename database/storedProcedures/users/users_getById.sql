DELIMITER $$
    CREATE DEFINER=`root`@`localhost` PROCEDURE `users_getById`(_id varchar(45))
    
    BEGIN
        
        select * from  users where id=_id;
    
    END$$
    DELIMITER ;
    
    