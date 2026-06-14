import { PRIORITY_OPTIONS, TEST_OPTIONS } from '../constants/orderConstants'

function OrderForm({
  register,
  watch,
  errors,
  isSubmitting,
  submitMessage,
  onSubmit,
}) {
  const selectedPriority = watch('priority') || 'Routine'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minDate = today.toISOString().split('T')[0]
  return (
    <article className="panel panel-form">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Order submission</p>
          <h2>Create a new lab order</h2>
        </div>        
      </header>

      <form onSubmit={onSubmit} className="order-form" noValidate>
        <label className="field">
          <span>Patient Name</span>
          <input
            type="text"
            placeholder="Enter patient name"
            aria-invalid={Boolean(errors.patientName)}
            {...register('patientName', { required: 'Patient name is required.' })}
          />
          {errors.patientName && <small className="field-error">{errors.patientName.message}</small>}
        </label>

        <label className="field">
          <span>Test Type</span>
          <select
            aria-invalid={Boolean(errors.testType)}
            {...register('testType', { required: 'Please choose a test type.' })}
          >
            <option value="">Select test type</option>
            {TEST_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.testType && <small className="field-error">{errors.testType.message}</small>}
        </label>

        <fieldset className="field field-radio-group">
          <legend>Priority</legend>
          <div className="radio-row">
            {PRIORITY_OPTIONS.map((option) => (
              <label key={option} className={`radio-chip ${selectedPriority === option ? 'active' : ''}`}>
                <input
                  type="radio"
                  value={option}
                  {...register('priority', { required: 'Please choose a priority.' })}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {errors.priority && <small className="field-error">{errors.priority.message}</small>}
        </fieldset>

        <label className="field">
          <span>Collection Date</span>
          <input
            type="date"
            min={minDate}
            aria-invalid={Boolean(errors.collectionDate)}
            {...register('collectionDate', {
              required: 'Collection date is required.',
              validate: (value) => {
                if (!value) {
                  return 'Collection date is required.'
                }

                const selectedDate = new Date(`${value}T00:00:00`)
                const todayDate = new Date()
                todayDate.setHours(0, 0, 0, 0)

                return selectedDate >= todayDate || 'Collection date cannot be in the past.'
              },
            })}
          />
          {errors.collectionDate && <small className="field-error">{errors.collectionDate.message}</small>}
        </label>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="submit-button-content" aria-live="polite">
              <span className="spinner" aria-hidden="true" />
              Submitting…
            </span>
          ) : (
            'Submit order'
          )}
        </button>

        {errors.root?.message && <p className="form-message form-message-error">{errors.root.message}</p>}
        {submitMessage && <p className="form-message form-message-success">{submitMessage}</p>}
      </form>
    </article>
  )
}

export default OrderForm
