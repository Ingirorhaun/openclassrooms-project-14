import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'

// BrowserRouter wrapper needed if Header uses Link or NavLink components
const HeaderWrapper = () => {
  return (
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  )
}

describe('Header component', () => {
  it('renders correctly', () => {
    render(<HeaderWrapper />)
  })

  it('displays the website title', () => {
    render(<HeaderWrapper />)
    const logo = screen.getByRole('heading', { name: /hrnet/i })
    expect(logo).toBeInTheDocument()
  })

  it('contains navigation links', () => {
    render(<HeaderWrapper />)
    const homeLink = screen.getByRole('link', { name: /home/i })
    const employeesLink = screen.getByRole('link', { name: /employees/i })
    
    expect(homeLink).toBeInTheDocument()
    expect(employeesLink).toBeInTheDocument()
  })

  it('has correct navigation links href attributes', () => {
    render(<HeaderWrapper />)
    const homeLink = screen.getByRole('link', { name: /home/i })
    const employeesLink = screen.getByRole('link', { name: /employees/i })
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(employeesLink).toHaveAttribute('href', '/employee-list')
  })
})
