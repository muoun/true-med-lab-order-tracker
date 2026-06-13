import { formatDate } from '../utils/dateUtils'

function OrderList({ orders, isLoadingOrders, loadError, onRefresh }) {
  return (
    <article className="panel panel-list">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Order list</p>
          <h2>Submitted orders</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onRefresh} disabled={isLoadingOrders}>
          {isLoadingOrders ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      {loadError && <p className="form-message form-message-error">{loadError}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Test</th>
              <th>Priority</th>
              <th>Collection date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && !isLoadingOrders ? (
              <tr>
                <td colSpan="4" className="empty-state">No orders submitted yet.</td>
              </tr>
            ) : (
              orders.map((order) => {
                const isStat = String(order.priority || '').toLowerCase() === 'stat'

                return (
                  <tr
                    key={`${order.patientName || 'patient'}-${order.testType || 'test'}-${order.collectionDate || 'date'}`}
                    className={isStat ? 'stat-row' : ''}
                  >
                    <td>
                      <strong>{order.patientName || 'Unknown patient'}</strong>
                    </td>
                    <td>{order.testType || '—'}</td>
                    <td>
                      <span className={`priority-tag ${isStat ? 'priority-tag-stat' : 'priority-tag-routine'}`}>
                        {order.priority || 'Routine'}
                      </span>
                    </td>
                    <td>{formatDate(order.collectionDate)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export default OrderList
