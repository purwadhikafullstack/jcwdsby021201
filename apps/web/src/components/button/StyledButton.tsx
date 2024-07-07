import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

interface StyledButtonProps extends ButtonProps {
  backgroundColor?: string;
  textColor?: string;
  hoverBackgroundColor?: string;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) =>
    !['backgroundColor', 'textColor', 'hoverBackgroundColor'].includes(
      prop as string,
    ),
})<StyledButtonProps>(
  ({
    theme,
    backgroundColor = '#000000',
    textColor = '#ffffff',
    hoverBackgroundColor = '#333333',
  }) => ({
    backgroundColor: backgroundColor,
    color: textColor,
    fontWeight: 'bold',
    padding: '12px 16px',
    fontSize: '14px',
    textTransform: 'uppercase',
    width: '100%',
    borderRadius: 0,
    '&:hover': {
      backgroundColor: hoverBackgroundColor,
    },
    '&:disabled': {
      backgroundColor: '#767677',
      color: '#ffffff',
    },
  }),
);

export default StyledButton;
