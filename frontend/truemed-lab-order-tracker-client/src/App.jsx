import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const { orders, isLoadingOrders, loadError, statCount, refreshOrders } = useOrders()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialForm,
  })

  const onSubmit = async (data) => {
    clearErrors()
    setIsSubmitting(true)
    setSubmitMessage('')

    const payload = {
      patientName: data.patientName.trim(),
      testType: data.testType,
      priority: data.priority,
      collectionDate: data.collectionDate
        ? new Date(`${data.collectionDate}T12:00:00`).toISOString()
        : null,
    }

    try {
      await createOrder(payload)

      reset(initialForm)
      setSubmitMessage('Order submitted successfully. The list has been refreshed.')
      await refreshOrders()
    } catch (error) {
      const responseBody = error?.responseBody || null
      const rawErrors = responseBody?.errors || {}

      Object.entries(rawErrors).forEach(([key, value]) => {
        const fieldName = getFormFieldName(key)
        const messages = Array.isArray(value) ? value : [value]

        setError(fieldName, {
          type: 'server',
          message: messages.filter(Boolean).join(' '),
        })
      })

      const fallbackMessage =
        responseBody?.title ||
        responseBody?.message ||
        responseBody?.detail ||
        (error instanceof Error
          ? error.message
          : 'The order could not be submitted. Please review the form and try again.')

      setError('root', {
        type: 'server',
        message: fallbackMessage,
      })
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
          register={register}
          watch={watch}
          errors={errors}
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
          onSubmit={handleSubmit(onSubmit)}
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
