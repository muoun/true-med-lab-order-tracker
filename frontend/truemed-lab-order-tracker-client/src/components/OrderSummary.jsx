function OrderSummary({ orders, statCount }) {
  return (
    <aside className="hero-stats" aria-label="Order summary">
      <article>
        <strong>{orders.length}</strong>
        <span>Total orders</span>
      </article>
      <article className="stat-summary-card">
        <strong>{statCount}</strong>
        <span>STAT orders</span>
      </article>
    </aside>
  )
}

export default OrderSummary
