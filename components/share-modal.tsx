"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Share2, Copy, Mail, Check } from "lucide-react"

interface ShareModalProps {
  itinerary: any
  destination: string
}

export function ShareModal({ itinerary, destination }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(`Check out my travel itinerary for ${destination}!`)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareText = `${itinerary.title} - ${itinerary.days.length} day trip to ${destination}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Travel Itinerary: ${destination}`)
    const body = encodeURIComponent(`${message}\n\nView the full itinerary: ${shareUrl}`)
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`
    window.open(mailtoUrl)
  }

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(shareText)
    const url = encodeURIComponent(shareUrl)

    let shareLink = ""
    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "whatsapp":
        shareLink = `https://wa.me/?text=${text}%20${url}`
        break
      case "telegram":
        shareLink = `https://t.me/share/url?url=${url}&text=${text}`
        break
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400")
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: itinerary.title,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-forest-green font-poppins">Share Your Itinerary</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Copy Link */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Share Link</Label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-transparent"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Native Share (if supported) */}
          {typeof navigator !== "undefined" && navigator.share && (
            <Button onClick={handleNativeShare} className="w-full bg-forest-green hover:bg-forest-green/90">
              <Share2 className="w-4 h-4 mr-2" />
              Share via Device
            </Button>
          )}

          {/* Social Media Sharing */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share on Social Media</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleSocialShare("twitter")}
                variant="outline"
                size="sm"
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                Twitter
              </Button>
              <Button
                onClick={() => handleSocialShare("facebook")}
                variant="outline"
                size="sm"
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                Facebook
              </Button>
              <Button
                onClick={() => handleSocialShare("whatsapp")}
                variant="outline"
                size="sm"
                className="bg-green-50 hover:bg-green-100 border-green-200"
              >
                WhatsApp
              </Button>
              <Button
                onClick={() => handleSocialShare("telegram")}
                variant="outline"
                size="sm"
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                Telegram
              </Button>
            </div>
          </div>

          {/* Email Sharing */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share via Email</Label>
            <div className="space-y-2">
              <Input placeholder="Recipient email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Textarea
                placeholder="Add a personal message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              <Button onClick={handleEmailShare} disabled={!email} variant="outline" className="w-full bg-transparent">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
