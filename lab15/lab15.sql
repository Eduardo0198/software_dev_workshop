SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lab15_mariadb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Entregan`
--

CREATE TABLE `Entregan` (
  `Clave` int(11) NOT NULL,
  `RFC` varchar(13) NOT NULL,
  `Numero` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Entregan`
--

INSERT INTO `Entregan` (`Clave`, `RFC`, `Numero`, `Fecha`, `Cantidad`) VALUES
(1, 'ABC123456AAA', 101, '2026-03-01', 50),
(1, 'ABC123456AAA', 101, '2026-03-05', 30),
(2, 'DEF123456BBB', 102, '2026-03-02', 70),
(3, 'GHI123456CCC', 103, '2026-03-03', 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Materiales`
--

CREATE TABLE `Materiales` (
  `Clave` int(11) NOT NULL,
  `Descripcion` varchar(100) NOT NULL,
  `Costo` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Materiales`
--

INSERT INTO `Materiales` (`Clave`, `Descripcion`, `Costo`) VALUES
(1, 'Cemento', 180.50),
(2, 'Arena', 95.00),
(3, 'Varilla', 210.75);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Proveedores`
--

CREATE TABLE `Proveedores` (
  `RFC` varchar(13) NOT NULL,
  `RazonSocial` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Proveedores`
--

INSERT INTO `Proveedores` (`RFC`, `RazonSocial`) VALUES
('ABC123456AAA', 'Materiales del Centro'),
('DEF123456BBB', 'Proveedora Queretana'),
('GHI123456CCC', 'Suministros Industriales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Proyectos`
--

CREATE TABLE `Proyectos` (
  `Numero` int(11) NOT NULL,
  `Denominacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Proyectos`
--

INSERT INTO `Proyectos` (`Numero`, `Denominacion`) VALUES
(101, 'Edificio A'),
(102, 'Puente Norte'),
(103, 'Bodega Central');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Entregan`
--
ALTER TABLE `Entregan`
  ADD PRIMARY KEY (`Clave`,`RFC`,`Numero`,`Fecha`),
  ADD KEY `RFC` (`RFC`),
  ADD KEY `Numero` (`Numero`);

--
-- Indices de la tabla `Materiales`
--
ALTER TABLE `Materiales`
  ADD PRIMARY KEY (`Clave`);

--
-- Indices de la tabla `Proveedores`
--
ALTER TABLE `Proveedores`
  ADD PRIMARY KEY (`RFC`);

--
-- Indices de la tabla `Proyectos`
--
ALTER TABLE `Proyectos`
  ADD PRIMARY KEY (`Numero`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Entregan`
--
ALTER TABLE `Entregan`
  ADD CONSTRAINT `entregan_ibfk_1` FOREIGN KEY (`Clave`) REFERENCES `Materiales` (`Clave`),
  ADD CONSTRAINT `entregan_ibfk_2` FOREIGN KEY (`RFC`) REFERENCES `Proveedores` (`RFC`),
  ADD CONSTRAINT `entregan_ibfk_3` FOREIGN KEY (`Numero`) REFERENCES `Proyectos` (`Numero`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;