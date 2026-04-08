const UserAvatar = ({ name, size = 40 }) => {
  // Генерируем уникальную аватарку на основе имени
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    return (
    <img
        src={avatarUrl}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', backgroundColor: '#f0f0f0' }}
    />
    );
};

export default UserAvatar;