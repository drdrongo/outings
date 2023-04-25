import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';
import '@testing-library/jest-dom';
import Layout from '@/components/Layout';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      // ... whatever else you you call on `router`
    };
  },
}));

describe('Home', () => {
  it('renders a layout', () => {
    const component = render(<Layout />);

    // expect(component.contains(<ComponentName />)).toBe(false)
    expect(component.queryByText("Text I care about")).not.toBeInTheDocument();

    const { getAllByTestId, getByTestId } = render(<Layout />);
    const appHeader = getByTestId('app-header')
    const clocksInHeader = within(appHeader).getAllByTestId('clock')
  

    // expect(component.find('selector').exists()).toBeTruthy()

    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i,
    });

    // div className={[styles.contentContainer

    expect(heading).toBeInTheDocument();
  });
});
