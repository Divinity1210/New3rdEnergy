/**
 * Support Ticket Service — Customer Support & Engineering Escalation
 * 
 * Manages customer support tickets, threaded conversations, attachments,
 * status workflows, and seamless escalation from AI Assistant.
 */

import { SupportTicket, TicketMessage, TicketCategory, TicketPriority, TicketAttachment } from '@/lib/types';
import { supportTicketsStore, customerNotificationsStore, StoreEntity } from './store-service';
import { seedDemoCustomerData } from './customer-auth-service';

export async function listCustomerTickets(customerId: string): Promise<SupportTicket[]> {
  if (customerId === 'cust_demo_user_01') await seedDemoCustomerData();
  const raw = await supportTicketsStore.findBy('customerId', customerId);
  return raw as unknown as SupportTicket[];
}

export async function getTicketById(ticketId: string, customerId?: string): Promise<SupportTicket | null> {
  if (customerId === 'cust_demo_user_01') await seedDemoCustomerData();
  const raw = await supportTicketsStore.get(ticketId);
  if (!raw) return null;
  const ticket = raw as unknown as SupportTicket;
  if (customerId && ticket.customerId !== customerId) return null;
  return ticket;
}

export async function createSupportTicket(data: {
  customerId: string;
  customerName: string;
  customerEmail: string;
  systemId?: string;
  systemName?: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  initialDescription: string;
  attachments?: TicketAttachment[];
  escalatedFromAi?: boolean;
}): Promise<SupportTicket> {
  const now = new Date().toISOString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const ticketNumber = `3E-TCK-${new Date().getFullYear()}-${randomSuffix}`;
  const ticketId = `tck_${Date.now()}`;

  const initialMessage: TicketMessage = {
    id: `tmsg_${Date.now()}`,
    ticketId,
    senderId: data.customerId,
    senderName: data.customerName,
    senderType: 'CUSTOMER',
    content: data.initialDescription,
    attachments: data.attachments || [],
    timestamp: now,
  };

  const ticket: SupportTicket = {
    id: ticketId,
    ticketNumber,
    customerId: data.customerId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    systemId: data.systemId,
    systemName: data.systemName,
    category: data.category,
    priority: data.priority,
    status: 'NEW_REQUEST',
    subject: data.subject,
    initialDescription: data.initialDescription,
    messages: [initialMessage],
    attachments: data.attachments || [],
    escalatedFromAi: data.escalatedFromAi || false,
    createdAt: now,
    updatedAt: now,
  };

  await supportTicketsStore.create(ticket as StoreEntity & Record<string, unknown>);

  // Customer notification
  await customerNotificationsStore.create({
    id: `notif_${Date.now()}`,
    customerId: data.customerId,
    type: 'TICKET_REPLY',
    title: `Ticket Created: ${ticketNumber}`,
    message: `Your ticket "${data.subject}" has been received. A dedicated engineering specialist will respond.`,
    link: `/my-energy/support/${ticketId}`,
    isRead: false,
    createdAt: now,
    updatedAt: now,
  } as StoreEntity & Record<string, unknown>);

  return ticket;
}

export async function addTicketMessage(
  ticketId: string,
  message: {
    senderId: string;
    senderName: string;
    senderType: 'CUSTOMER' | 'AGENT' | 'SYSTEM' | 'AI_ASSISTANT';
    content: string;
    attachments?: TicketAttachment[];
  }
): Promise<SupportTicket | null> {
  const raw = await supportTicketsStore.get(ticketId);
  if (!raw) return null;
  const ticket = raw as unknown as SupportTicket;

  const now = new Date().toISOString();
  const newMessage: TicketMessage = {
    id: `tmsg_${Date.now()}`,
    ticketId,
    senderId: message.senderId,
    senderName: message.senderName,
    senderType: message.senderType,
    content: message.content,
    attachments: message.attachments || [],
    timestamp: now,
  };

  const updatedMessages = [...(ticket.messages || []), newMessage];
  const newStatus = message.senderType === 'CUSTOMER' ? 'IN_PROGRESS' : 'WAITING_FOR_CUSTOMER';

  const updated = await supportTicketsStore.update(ticketId, {
    messages: updatedMessages,
    status: newStatus,
    updatedAt: now,
  });

  return updated as unknown as SupportTicket;
}
