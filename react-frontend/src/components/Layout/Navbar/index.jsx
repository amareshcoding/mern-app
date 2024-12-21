const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white text-gray-600 py-4 px-8 shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">My Navbar</h1>
        <ul className="flex space-x-6">
          <li>
            <a href="#home" className="hover:text-gray-300">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-gray-300">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-300">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
