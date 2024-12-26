export interface Avatar {
  public_id: string;
  url: string;
  _id: string;
  id: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string[];
  avatar: Avatar[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  read: boolean;
  deleteBySender: boolean;
  deleteByRecipient: boolean;
  timestamp: string;
}
