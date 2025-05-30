import Button from '@mui/material/Button';

export default function IconLabelButton({ 
  variant = "contained", 
  iconPosition = "end", 
  icon, 
  children, 
  ...props 
}) {
  return (
    <Button
      variant={variant}
      {...(iconPosition === "start" ? { startIcon: icon } : { endIcon: icon })}
      {...props}
    >
      {children}
    </Button>
  );
}
