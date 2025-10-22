import { Template } from '../models/Template'

interface NarrationResult {
  text: string
  metadata: {
    category: string
    riskLevel: 'low' | 'medium' | 'high'
    gasEfficiency: 'excellent' | 'good' | 'fair' | 'poor'
    tags: string[]
  }
}

export class NarrationService {
  private templates: Map<string, any> = new Map()

  async generateNarration(transactionData: any): Promise<NarrationResult> {
    try {
      // Try to find a matching template
      const template = await this.findMatchingTemplate(transactionData)
      
      if (template) {
        return this.generateFromTemplate(template, transactionData)
      }

      // Fallback to basic narration
      return this.generateBasicNarration(transactionData)
    } catch (error) {
      console.error('Error generating narration:', error)
      return this.generateBasicNarration(transactionData)
    }
  }

  private async findMatchingTemplate(transactionData: any) {
    const { protocol, method, type } = transactionData

    // Look for exact match first
    let template = await Template.findOne({
      protocol: protocol.toLowerCase(),
      method: method.toLowerCase(),
      isActive: true
    })

    if (template) {
      return template
    }

    // Look for type-based match
    template = await Template.findOne({
      'metadata.category': type,
      isActive: true
    })

    return template
  }

  private generateFromTemplate(template: any, transactionData: any): NarrationResult {
    let narration = template.template

    // Replace variables in template
    for (const variable of template.variables) {
      const value = this.getVariableValue(variable.name, transactionData)
      const placeholder = `{${variable.name}}`
      narration = narration.replace(new RegExp(placeholder, 'g'), value)
    }

    return {
      text: narration,
      metadata: {
        category: template.category,
        riskLevel: template.riskLevel,
        gasEfficiency: this.calculateGasEfficiency(transactionData),
        tags: template.tags || []
      }
    }
  }

  private generateBasicNarration(transactionData: any): NarrationResult {
    const { type, protocol, method, value, from, to, tokens } = transactionData

    let narration = ''

    switch (type) {
      case 'eth_transfer':
        narration = `You transferred ${parseFloat(value).toFixed(4)} ETH from ${this.formatAddress(from)} to ${this.formatAddress(to)}.`
        break

      case 'token_transfer':
        if (tokens && tokens.length > 0) {
          const token = tokens[0]
          narration = `You transferred ${parseFloat(token.amount).toFixed(2)} ${token.symbol || 'tokens'} from ${this.formatAddress(from)} to ${this.formatAddress(to)}.`
        } else {
          narration = `You transferred tokens from ${this.formatAddress(from)} to ${this.formatAddress(to)}.`
        }
        break

      case 'swap':
        narration = `You performed a token swap on ${protocol}.`
        break

      case 'liquidity_add':
        narration = `You added liquidity to a ${protocol} pool.`
        break

      case 'liquidity_remove':
        narration = `You removed liquidity from a ${protocol} pool.`
        break

      case 'lending':
        narration = `You interacted with ${protocol} lending protocol.`
        break

      case 'contract_interaction':
        narration = `You interacted with a smart contract on ${protocol}.`
        break

      default:
        narration = `You performed a ${type} transaction on ${protocol}.`
    }

    return {
      text: narration,
      metadata: {
        category: type,
        riskLevel: this.assessRiskLevel(transactionData),
        gasEfficiency: this.calculateGasEfficiency(transactionData),
        tags: this.generateTags(transactionData)
      }
    }
  }

  private getVariableValue(variableName: string, transactionData: any): string {
    switch (variableName) {
      case 'value':
        return parseFloat(transactionData.value).toFixed(4)
      case 'from':
        return this.formatAddress(transactionData.from)
      case 'to':
        return this.formatAddress(transactionData.to)
      case 'protocol':
        return transactionData.protocol
      case 'method':
        return transactionData.method
      case 'tokenAmount':
        return transactionData.tokens?.[0]?.amount || '0'
      case 'tokenSymbol':
        return transactionData.tokens?.[0]?.symbol || 'tokens'
      default:
        return transactionData[variableName] || ''
    }
  }

  private formatAddress(address: string): string {
    if (!address) return 'Unknown'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  private assessRiskLevel(transactionData: any): 'low' | 'medium' | 'high' {
    const { type, value, protocol } = transactionData

    // High risk factors
    if (type === 'contract_interaction' && protocol === 'unknown') return 'high'
    if (parseFloat(value) > 10) return 'high' // High value transactions

    // Medium risk factors
    if (type === 'swap' || type === 'liquidity_add' || type === 'liquidity_remove') return 'medium'
    if (parseFloat(value) > 1) return 'medium'

    // Low risk
    return 'low'
  }

  private calculateGasEfficiency(transactionData: any): 'excellent' | 'good' | 'fair' | 'poor' {
    const gasUsed = parseInt(transactionData.gasUsed)
    const gasPrice = parseInt(transactionData.gasPrice)

    if (gasUsed < 100000) return 'excellent'
    if (gasUsed < 200000) return 'good'
    if (gasUsed < 300000) return 'fair'
    return 'poor'
  }

  private generateTags(transactionData: any): string[] {
    const tags: string[] = []
    const { type, protocol, value } = transactionData

    // Type-based tags
    tags.push(type)

    // Protocol tags
    if (protocol !== 'unknown') {
      tags.push(protocol.toLowerCase())
    }

    // Value-based tags
    const valueNum = parseFloat(value)
    if (valueNum > 10) tags.push('high-value')
    if (valueNum < 0.01) tags.push('micro-transaction')

    // Gas efficiency tags
    const gasEfficiency = this.calculateGasEfficiency(transactionData)
    tags.push(`gas-${gasEfficiency}`)

    return tags
  }
}
