import Modal from '../Modal/Modal'
import ElegirOperacion from './ElegirOperacion'
import FormularioDeposito from './FormularioDeposito'
import FormularioConversion from './FormularioConversion'
import FormularioTransferencia from './FormularioTransferencia'
import { useOperaciones } from '../../context/OperacionesContext'

// Las ventanas de operaciones, disponibles en todas las páginas
export default function Operaciones() {
  const { abierta, cerrarOperacion, operacionRealizada } = useOperaciones()

  function alTerminar() {
    cerrarOperacion()
    operacionRealizada()
  }

  return (
    <>
      <Modal titulo="Nueva operación" abierto={abierta === 'elegir'} onCerrar={cerrarOperacion}>
        <ElegirOperacion />
      </Modal>

      <Modal titulo="Ingresar dinero" abierto={abierta === 'deposito'} onCerrar={cerrarOperacion}>
        <FormularioDeposito onListo={alTerminar} />
      </Modal>

      <Modal titulo="Convertir moneda" abierto={abierta === 'conversion'} onCerrar={cerrarOperacion}>
        <FormularioConversion onListo={alTerminar} />
      </Modal>

      <Modal
        titulo="Transferir dinero"
        abierto={abierta === 'transferencia'}
        onCerrar={cerrarOperacion}
      >
        <FormularioTransferencia onListo={alTerminar} />
      </Modal>
    </>
  )
}