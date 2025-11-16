
export default function SideMenu() {
  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 p-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Side Menu</h2>
      <nav className="flex flex-col space-y-4">
        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Home</a>
        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Profile</a>
        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Settings</a>
        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Logout</a>
      </nav>
    </div>
  )
}