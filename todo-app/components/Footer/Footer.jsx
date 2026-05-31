import "./Footer.css";
const Footer = () => {
  return (
    <footer className="w-full py-4 text-center border-t mt-8">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Todo App. Built by Eswar Mavulluru.
      </p>
    </footer>
  );
};

export default Footer;