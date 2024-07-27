export function parseFlags(argv: string[]): Record<string, string> {
    const flags: Record<string, string> = {}
    
    argv.forEach(arg => {
        if (arg.startsWith('--')) {
            const [flag, value] = arg.split('=') // Split the argument by '=' to separate flag and value
            const flagName = flag.slice(2) // Remove the leading '--' from the flag name
            
            flags[flagName] = value || './.env' // If no value is provided, set it to true
        }
    })

    return flags
}

export interface Parser {
    toString(defaults?: string): string
    toStringArray(defaults?: string[]): string[]
    toBoolean(defaults?: boolean): boolean
    toNumber(defaults?: number): number
    toNumberArray(defaults?: number[]): number[]
}

export function parse(value?: string): Parser {
    function toString(defaults?: string): string {
        if (value) return value
        if (!value && defaults) return defaults
        
        return ''
    }

    function toStringArray(defaults?: string[]): string[] {
        if (value) return value.split(',')
        if (!value && defaults) return defaults

        return ['']
    }

    function toBoolean(defaults?: boolean): boolean {
        if (value) return value === 'true'
        if (!value && defaults) return defaults

        return false
    }

    function toNumber(defaults?: number): number {
        if (value) return Number(value)
        if (!value && defaults) return defaults

        return 0
    }

    function toNumberArray(defaults?: number[]): number[] {
        if (value) return value.split(',').map(el => Number(el))
        if (!value && defaults) return defaults

        return [0]
    }

    return {
        toString,
        toStringArray,
        toBoolean,
        toNumber,
        toNumberArray,
    }
}