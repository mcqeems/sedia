import Logo from "../Logo";

export default function Navbar() {
  return (
    <nav>
      <div>
        <div className="text-primary drop-shadow-xl h-24 w-24">
          <Logo />
        </div>
      </div>
    </nav>
  );
}
