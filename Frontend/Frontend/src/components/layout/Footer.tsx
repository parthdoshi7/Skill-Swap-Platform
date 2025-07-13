import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container flex flex-col sm:flex-row items-center justify-between py-8 gap-4">
        <div className="text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            © 2025 SkillSwap Platform. All rights reserved.
          </p>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/about" className="text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="text-muted-foreground hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}