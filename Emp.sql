
DROP TABLE EMP;

CREATE TABLE EMP
(EMPNO NUMERIC(4) NOT NULL,
ENAME VARCHAR(10),
JOB VARCHAR(9),
MGR NUMERIC(4),
HIREDATE DATETIME,
SAL NUMERIC(7, 2),
COMM NUMERIC(7, 2),
DEPTNO NUMERIC(2));

INSERT INTO EMP VALUES
(7369, ‘SMITH’, ‘CLERK’, 7902, ’17-DEC-1980′, 800, NULL, 20);
INSERT INTO EMP VALUES
(7499, ‘ALLEN’, ‘SALESMAN’, 7698, ’20-FEB-1981′, 1600, 300, 30);
INSERT INTO EMP VALUES
(7521, ‘WARD’, ‘SALESMAN’, 7698, ’22-FEB-1981′, 1250, 500, 30);

exit;