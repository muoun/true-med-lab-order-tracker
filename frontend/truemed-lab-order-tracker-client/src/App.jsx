import { useState } from 'react'
import './App.css'

import OrderForm from './components/OrderForm'
import OrderList from './components/OrderList'
import OrderSummary from './components/OrderSummary'
import { useOrders } from './hooks/useOrders'
import { createOrder } from './services/orderService'
import { normalizeFieldKey } from './utils/validationUtils'

const initialForm = {
  patientName: '',
  testType: '',
  priority: 'Routine',
  collectionDate: '',
}

const getFormFieldName = (key) => {
  const normalizedKey = normalizeFieldKey(key)

  return (
    Object.keys(initialForm).find((fieldName) => normalizeFieldKey(fieldName) === normalizedKey) ||
    normalizedKey
  )
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const { orders, isLoadingOrders, loadError, statCount, refreshOrders } = useOrders()

  const validateForm = () => {
    const nextErrors = {}

    if (!form.patientName.trim()) {
      nextErrors.patientName = 'Patient name is required.'
    }

    if (!form.testType.trim()) {
      nextErrors.testType = 'Please choose a test type.'
    }

    if (!form.priority.trim()) {
      nextErrors.priority = 'Please choose a priority.'
    }

    if (!form.collectionDate) {
      nextErrors.collectionDate = 'Collection date is required.'
    } else {
      const selectedDate = new Date(`${form.collectionDate}T00:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        nextErrors.collectionDate = 'Collection date cannot be in the past.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
      submit: '',
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      setSubmitMessage('Please fix the highlighted fields before submitting the order.')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')
    setErrors((current) => ({ ...current, submit: '' }))

    const payload = {
      patientName: form.patientName.trim(),
      testType: form.testType,
      priority: form.priority,
      collectionDate: form.collectionDate
        ? new Date(`${form.collectionDate}T12:00:00`).toISOString()
        : null,
    }

    try {
      await createOrder(payload)

      setForm(initialForm)
      setErrors({})
      setSubmitMessage('Order submitted successfully. The list has been refreshed.')
      await refreshOrders()
    } catch (error) {
      const responseBody = error?.responseBody || null
      const apiErrors = {}
      const rawErrors = responseBody?.errors || {}

      Object.entries(rawErrors).forEach(([key, value]) => {
        const fieldName = getFormFieldName(key)
        const messages = Array.isArray(value) ? value : [value]
        apiErrors[fieldName] = messages.filter(Boolean).join(' ')
      })

      const fallbackMessage =
        responseBody?.title ||
        responseBody?.message ||
        responseBody?.detail ||
        (error instanceof Error
          ? error.message
          : 'The order could not be submitted. Please review the form and try again.')

      setErrors((current) => ({
        ...current,
        ...apiErrors,
        submit: fallbackMessage,
      }))
      setSubmitMessage('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">True Med Lab Order Tracker</p>
          <h1>Submit and monitor patient lab orders in one place.</h1>
          <p className="lead">
            Capture the patient, test type, urgency, and collection date, then keep the order
            list current without a manual refresh.
          </p>
        </div>
        <OrderSummary orders={orders} statCount={statCount} />
      </section>

      <section className="dashboard-grid">
        <OrderForm
          form={form}
          errors={errors}
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
        />

        <OrderList
          orders={orders}
          isLoadingOrders={isLoadingOrders}
          loadError={loadError}
          onRefresh={refreshOrders}
        />
      </section>
    </main>
  )
}

export default App
