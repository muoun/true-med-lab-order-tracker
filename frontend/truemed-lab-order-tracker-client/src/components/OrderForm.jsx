import { PRIORITY_OPTIONS, TEST_OPTIONS } from '../constants/orderConstants'

function OrderForm({
  form,
  errors,
  isSubmitting,
  submitMessage,
  onFieldChange,
  onSubmit,
}) {
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
            name="patientName"
            value={form.patientName}
            onChange={onFieldChange}
            placeholder="Enter patient name"
            aria-invalid={Boolean(errors.patientName)}
          />
          {errors.patientName && <small className="field-error">{errors.patientName}</small>}
        </label>

        <label className="field">
          <span>Test Type</span>
          <select
            name="testType"
            value={form.testType}
            onChange={onFieldChange}
            aria-invalid={Boolean(errors.testType)}
          >
            <option value="">Select test type</option>
            {TEST_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.testType && <small className="field-error">{errors.testType}</small>}
        </label>

        <fieldset className="field field-radio-group">
          <legend>Priority</legend>
          <div className="radio-row">
            {PRIORITY_OPTIONS.map((option) => (
              <label key={option} className={`radio-chip ${form.priority === option ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="priority"
                  value={option}
                  checked={form.priority === option}
                  onChange={onFieldChange}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {errors.priority && <small className="field-error">{errors.priority}</small>}
        </fieldset>

        <label className="field">
          <span>Collection Date</span>
          <input
            type="date"
            name="collectionDate"
            value={form.collectionDate}
            onChange={onFieldChange}
            aria-invalid={Boolean(errors.collectionDate)}
          />
          {errors.collectionDate && <small className="field-error">{errors.collectionDate}</small>}
        </label>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit order'}
        </button>

        {errors.submit && <p className="form-message form-message-error">{errors.submit}</p>}
        {submitMessage && <p className="form-message form-message-success">{submitMessage}</p>}
      </form>
    </article>
  )
}

export default OrderForm
