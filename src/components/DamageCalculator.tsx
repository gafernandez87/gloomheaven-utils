import { useState, useEffect, useMemo } from 'react'
import './DamageCalculator.css'

interface CalculationValues {
  hp: number
  shield: number
  pierce: number
  attack: number
}

interface CalculationResults {
  effectiveShield: number
  damage: number
  hpLeft: number
  warnings: string[]
}

const DEFAULT_VALUES: CalculationValues = {
  hp: 10,
  shield: 2,
  pierce: 1,
  attack: 3,
}

function toNonNegInt(value: string | number): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.floor(n))
}

function repeatIcon(icon: string, count: number): string {
  if (count <= 0) return ''
  return Array(count).fill(icon).join(' ')
}

function calculateDamage(values: CalculationValues): CalculationResults {
  const effectiveShield = Math.max(values.shield - values.pierce, 0)
  const damage = Math.max(values.attack - effectiveShield, 0)
  const hpLeft = Math.max(values.hp - damage, 0)

  return {
    effectiveShield,
    damage,
    hpLeft,
    warnings: [],
  }
}

function DamageCalculator() {
  const [values, setValues] = useState<CalculationValues>(DEFAULT_VALUES)
  const [inputStrings, setInputStrings] = useState<Record<keyof CalculationValues, string>>({
    hp: '10',
    shield: '2',
    pierce: '1',
    attack: '3',
  })

  const normalizedValues: CalculationValues = useMemo(() => ({
    hp: toNonNegInt(inputStrings.hp),
    shield: toNonNegInt(inputStrings.shield),
    pierce: toNonNegInt(inputStrings.pierce),
    attack: toNonNegInt(inputStrings.attack),
  }), [inputStrings])

  const results = useMemo(() => calculateDamage(normalizedValues), [normalizedValues])

  const warnings = useMemo(() => {
    const warn: string[] = []
    const fields: Array<{ key: keyof CalculationValues; label: string }> = [
      { key: 'hp', label: 'HP' },
      { key: 'shield', label: 'Shield' },
      { key: 'pierce', label: 'Pierce' },
      { key: 'attack', label: 'Attack' },
    ]

    fields.forEach(({ key, label }) => {
      const inputValue = inputStrings[key].trim()
      if (inputValue !== '' && Number(inputValue) !== normalizedValues[key]) {
        warn.push(`${label}: rounded down and/or corrected to ≥ 0`)
      }
    })

    return warn
  }, [inputStrings, normalizedValues])

  useEffect(() => {
    setValues(normalizedValues)
  }, [normalizedValues])

  const handleInputChange = (field: keyof CalculationValues, value: string) => {
    setInputStrings(prev => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setInputStrings({
      hp: String(DEFAULT_VALUES.hp),
      shield: String(DEFAULT_VALUES.shield),
      pierce: String(DEFAULT_VALUES.pierce),
      attack: String(DEFAULT_VALUES.attack),
    })
  }

  const getVisualBlocks = () => {
    const attackBlocks = repeatIcon('🟥', normalizedValues.attack) || '∅'
    const shieldBlocks = repeatIcon('🟦', normalizedValues.shield) || '∅'
    const pierceBlocks = repeatIcon('⬛', normalizedValues.pierce) || '∅'
    const shieldEBlocks = repeatIcon('🟦', results.effectiveShield) || '∅'
    const blocked = Math.min(normalizedValues.attack, results.effectiveShield)
    const blockedBlocks = repeatIcon('❌', blocked) || '∅'
    const passed = normalizedValues.attack - blocked
    const passedBlocks = repeatIcon('🟥', passed) || '∅'

    return {
      attackBlocks,
      shieldBlocks,
      pierceBlocks,
      shieldEBlocks,
      blockedBlocks,
      passedBlocks,
    }
  }

  const visual = getVisualBlocks()

  return (
    <div className="calculator-container">
      <div className="calculator-grid">
        <div className="input-card">
          <div className="card-glow"></div>
          <div className="card-content">
            <div className="input-group">
              <label htmlFor="hp" className="input-label">
                <span className="label-icon">❤️</span>
                Current HP
              </label>
              <input
                id="hp"
                type="number"
                min="0"
                step="1"
                value={inputStrings.hp}
                onChange={(e) => handleInputChange('hp', e.target.value)}
                className="gamer-input"
                placeholder="10"
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="shield" className="input-label">
                  <span className="label-icon">🛡️</span>
                  Shield
                </label>
                <input
                  id="shield"
                  type="number"
                  min="0"
                  step="1"
                  value={inputStrings.shield}
                  onChange={(e) => handleInputChange('shield', e.target.value)}
                  className="gamer-input"
                  placeholder="2"
                />
              </div>
              <div className="input-group">
                <label htmlFor="pierce" className="input-label">
                  <span className="label-icon">⚡</span>
                  Pierce
                </label>
                <input
                  id="pierce"
                  type="number"
                  min="0"
                  step="1"
                  value={inputStrings.pierce}
                  onChange={(e) => handleInputChange('pierce', e.target.value)}
                  className="gamer-input"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="attack" className="input-label">
                <span className="label-icon">⚔️</span>
                Attack Damage (already modified)
              </label>
              <input
                id="attack"
                type="number"
                min="0"
                step="1"
                value={inputStrings.attack}
                onChange={(e) => handleInputChange('attack', e.target.value)}
                className="gamer-input"
                placeholder="3"
              />
            </div>

            <div className="button-row">
              <button
                onClick={handleReset}
                className="gamer-button secondary"
                type="button"
              >
                <span>🔄</span>
                Reset
              </button>
            </div>

            {warnings.length > 0 && (
              <div className="warning-box">
                <div className="warning-icon">⚠️</div>
                <div className="warning-text">
                  {warnings.join(' • ')}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="results-card">
          <div className="card-glow results-glow"></div>
          <div className="card-content">
            <div className="results-grid">
              <div className="result-pill shield-pill">
                <div className="result-label">Effective Shield</div>
                <div className="result-value" data-testid="effective-shield">
                  {results.effectiveShield}
                </div>
                <div className="result-formula">
                  max({normalizedValues.shield} - {normalizedValues.pierce}, 0)
                </div>
              </div>

              <div className="result-pill damage-pill">
                <div className="result-label">Damage Taken</div>
                <div className="result-value damage-value" data-testid="damage">
                  {results.damage}
                </div>
                <div className="result-formula">
                  max({normalizedValues.attack} - {results.effectiveShield}, 0)
                </div>
              </div>

              <div className="result-pill hp-pill">
                <div className="result-label">Remaining HP</div>
                <div
                  className={`result-value hp-value ${results.hpLeft === 0 ? 'zero' : ''}`}
                  data-testid="hp-left"
                >
                  {results.hpLeft}
                </div>
                <div className="result-formula">
                  max({normalizedValues.hp} - {results.damage}, 0)
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 className="info-title">Calculation Order</h3>
              <ol className="info-list">
                <li>
                  <strong>Pierce</strong> reduces the target's <strong>Shield</strong> for this
                  attack.
                </li>
                <li>
                  The <strong>remaining Shield</strong> reduces the <strong>damage</strong>.
                </li>
                <li>Values never go below 0.</li>
              </ol>
            </div>

            <div className="visual-section">
              <h3 className="visual-title">Visual Representation</h3>
              <div className="visual-blocks">
                <div className="visual-line">
                  <span className="visual-label">Damage (Attack):</span>
                  <span className="visual-icons">{visual.attackBlocks || '∅'}</span>
                </div>
                <div className="visual-line">
                  <span className="visual-label">Shield:</span>
                  <span className="visual-icons">{visual.shieldBlocks || '∅'}</span>
                </div>
                <div className="visual-line">
                  <span className="visual-label">Pierce:</span>
                  <span className="visual-icons">{visual.pierceBlocks || '∅'}</span>
                  <span className="visual-arrow">→</span>
                  <span className="visual-label">Effective Shield:</span>
                  <span className="visual-icons">{visual.shieldEBlocks || '∅'}</span>
                </div>
                <div className="visual-line">
                  <span className="visual-label">Blocked:</span>
                  <span className="visual-icons">{visual.blockedBlocks || '∅'}</span>
                </div>
                <div className="visual-line highlight">
                  <span className="visual-label">Damage Passed:</span>
                  <span className="visual-icons">{visual.passedBlocks || '∅'}</span>
                  <span className="visual-arrow">→</span>
                  <span className="visual-result">Damage = <strong>{results.damage}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DamageCalculator

