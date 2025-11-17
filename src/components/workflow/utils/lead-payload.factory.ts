import type { SourceNodeType, LeadPayload } from "../types/node.types"

export class LeadPayloadFactory {
  static create(source: SourceNodeType, rawData: any): LeadPayload {
    const basePayload: LeadPayload = {
      id: this.generateId(),
      source,
      contact: this.extractContact(rawData),
      metadata: {
        timestamp: new Date().toISOString(),
        ...this.extractMetadata(rawData, source),
      },
      tags: this.extractTags(rawData, source),
      status: "new",
    }

    return basePayload
  }

  private static generateId(): string {
    return `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private static extractContact(data: any): LeadPayload["contact"] {
    return {
      name: data.name || data.fullName || data.contactName,
      phone: data.phone || data.phoneNumber || data.mobile,
      email: data.email || data.emailAddress,
      whatsapp: data.whatsapp || data.whatsappNumber || data.phone,
    }
  }

  private static extractMetadata(data: any, source: SourceNodeType): Record<string, any> {
    const metadata: Record<string, any> = {
      ip: data.ip || data.clientIp,
      userAgent: data.userAgent || data.user_agent,
      referrer: data.referrer || data.referer || data.utm_source,
    }

    if (source === "landing_page") {
      metadata.formData = data.formData
      metadata.pageUrl = data.pageUrl || data.url
      metadata.utmParams = {
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_term: data.utm_term,
        utm_content: data.utm_content,
      }
    }

    if (source === "whatsapp") {
      metadata.messageId = data.messageId
      metadata.chatId = data.chatId
      metadata.messageText = data.messageText
    }

    if (source === "email_campaign") {
      metadata.campaignId = data.campaignId
      metadata.emailId = data.emailId
      metadata.clickedLink = data.clickedLink
    }

    if (source === "facebook" || source === "instagram" || source === "tiktok") {
      metadata.postId = data.postId
      metadata.commentId = data.commentId
      metadata.adId = data.adId
    }

    if (source === "manual_entry") {
      metadata.enteredBy = data.enteredBy
      metadata.entryReason = data.entryReason
    }

    return metadata
  }

  private static extractTags(data: any, source: SourceNodeType): string[] {
    const tags: string[] = [source]

    if (data.tags && Array.isArray(data.tags)) {
      tags.push(...data.tags)
    }

    if (data.utm_campaign) {
      tags.push(`campaign:${data.utm_campaign}`)
    }

    if (data.priority) {
      tags.push(`priority:${data.priority}`)
    }

    return Array.from(new Set(tags))
  }

  static normalize(payload: Partial<LeadPayload>): LeadPayload {
    return {
      id: payload.id || this.generateId(),
      source: payload.source || "manual_entry",
      contact: {
        name: payload.contact?.name,
        phone: payload.contact?.phone,
        email: payload.contact?.email,
        whatsapp: payload.contact?.whatsapp,
      },
      metadata: {
        timestamp: payload.metadata?.timestamp || new Date().toISOString(),
        ...payload.metadata,
      },
      tags: payload.tags || [],
      score: payload.score,
      status: payload.status || "new",
    }
  }
}

