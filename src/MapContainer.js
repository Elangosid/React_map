import React, { useState, useEffect } from 'react'

const MapSearchForm = () => {
  const [location, setLocation] = useState('')
  const [iframeSrc, setIframeSrc] = useState('')
  const [addressDetails, setAddressDetails] = useState(null)

  useEffect(() => {
    setIframeSrc(`https://maps.google.com/maps?q=${location}&output=embed`)
  }, [location])

  const handleFormSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=YOUR_GOOGLE_MAPS_API_KEY`
      )

      if (!response.ok) {
        throw new Error('Error fetching address details')
      }

      const data = await response.json()

      if (data.results.length > 0) {
        const result = data.results[0]

        // Extract pincode
        const pincode = result.address_components.find((component) =>
          component.types.includes('postal_code')
        )

        // Extract latitude and longitude
        const { lat, lng } = result.geometry.location

        setAddressDetails({
          pincode: pincode ? pincode.long_name : 'N/A',
          latitude: lat,
          longitude: lng,
          fullAddress: result.formatted_address,
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <form className='form' onSubmit={handleFormSubmit}>
        <label style={{ fontWeight: 'bold' }}>
          Search the location:
          <input
            style={{
              border: 'solid gray',
              padding: '12px',
              margin: '8px',
              borderRadius: '5px',
            }}
            type='text'
            name='location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <input
          style={{
            border: 'solid gray',
            padding: '12px',
            margin: '8px',
            borderRadius: '5px',
            backgroundColor: 'gray',
          }}
          type='submit'
        />
      </form>
      {iframeSrc && (
        <iframe
          width='100%'
          height='500'
          src={iframeSrc}
          title='Google Map'
        ></iframe>
      )}

      {addressDetails && (
        <div>
          <h3>Address Details:</h3>
          <p>Pincode: {addressDetails.pincode}</p>
          <p>Latitude: {addressDetails.latitude}</p>
          <p>Longitude: {addressDetails.longitude}</p>
          <p>Full Address: {addressDetails.fullAddress}</p>
        </div>
      )}
    </div>
  )
}

export default MapSearchForm
