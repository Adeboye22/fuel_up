"use client"

import { useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Camera, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useDispatchStore from "@/stores/useDispatchStore"
import LoadingSpinner from "@/components/LoadingSpinner"

const ConfirmDelivery = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    otp: "",
    proofPhoto: null,
  })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const { confirmDelivery } = useDispatchStore()

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setFormData((prev) => ({ ...prev, otp: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, proofPhoto: file }))

      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await confirmDelivery(orderId, formData)

    if (result.success) {
      navigate("/dispatch/dashboard")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Confirm Delivery</h1>
        <p className="text-gray-600">Complete the delivery by entering OTP and uploading proof photo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Confirmation</CardTitle>
          <CardDescription>
            Enter the OTP provided by the customer and take a photo as proof of delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Customer OTP
              </label>
              <Input
                id="otp"
                type="text"
                value={formData.otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Ask the customer for their 6-digit OTP</p>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proof Photo</label>

              <div className="space-y-4">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Delivery proof"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreview(null)
                        setFormData((prev) => ({ ...prev, proofPhoto: null }))
                      }}
                      className="absolute top-2 right-2"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to take or upload a photo</p>
                    <p className="text-xs text-gray-500">Photo of delivered fuel or customer signature</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {preview ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dispatch/dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.otp || !formData.proofPhoto || loading} className="flex-1">
                {loading ? <LoadingSpinner size="sm" /> : "Confirm Delivery"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfirmDelivery
