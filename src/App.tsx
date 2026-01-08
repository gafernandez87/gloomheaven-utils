import DamageCalculator from './components/DamageCalculator'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="app-background">
        <div className="grid-overlay"></div>
      </div>
      <div className="app-content">
        <header className="app-header">
          <h1 className="title">
            <span className="title-icon">⚔️</span>
            Gloomhaven Damage Calculator
          </h1>
          <p className="subtitle">
            Calculate damage distribution with Shield and Pierce mechanics
          </p>
        </header>
        <DamageCalculator />
      </div>
    </div>
  )
}

export default App

