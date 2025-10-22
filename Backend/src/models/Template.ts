import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplate extends Document {
  protocol: string
  method: string
  functionSignature: string
  template: string
  variables: Array<{
    name: string
    type: string
    description: string
    required: boolean
  }>
  category: string
  riskLevel: 'low' | 'medium' | 'high'
  gasEstimate: number
  tags: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const VariableSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  required: { type: Boolean, default: true }
}, { _id: false })

const TemplateSchema = new Schema({
  protocol: { 
    type: String, 
    required: true,
    index: true 
  },
  method: { 
    type: String, 
    required: true,
    index: true 
  },
  functionSignature: { 
    type: String, 
    required: true,
    unique: true 
  },
  template: { 
    type: String, 
    required: true 
  },
  variables: [VariableSchema],
  category: { 
    type: String, 
    required: true,
    index: true 
  },
  riskLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    required: true 
  },
  gasEstimate: { 
    type: Number, 
    required: true 
  },
  tags: [String],
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
  }
}, {
  timestamps: true
})

// Indexes
TemplateSchema.index({ protocol: 1, method: 1 })
TemplateSchema.index({ functionSignature: 1 })
TemplateSchema.index({ category: 1, isActive: 1 })

export const Template = mongoose.model<ITemplate>('Template', TemplateSchema)
