import { User } from "lucide-react"

const UserAvatar = ({ user, className = "" }) => {
  // Get user's initials from first and last name
  const getInitials = () => {
    if (!user) return ""

    const name = user.name || ""
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""

    if (name) {
      const nameParts = name.split(" ")
      return nameParts.length > 1 ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}` : nameParts[0].charAt(0)
    }

    return firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : firstName.charAt(0) || ""
  }

  const initials = getInitials()
  const avatarClasses = `h-10 w-10 text-white rounded-full bg-emerald-600 flex items-center justify-center ${className}`

  return (
    <div className={avatarClasses}>
      {initials ? <span className="font-semibold text-sm">{initials}</span> : <User className="h-5 w-5" />}
    </div>
  )
}

export default UserAvatar
