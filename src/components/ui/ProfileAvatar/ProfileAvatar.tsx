import { useRef } from "react";
import "./profileAvatar.css";

interface Props {
  avatarUrl?: string;
  onChange: (file: File) => void;
}

export default function ProfileAvatar({ avatarUrl, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="profile-avatar" onClick={handleClick}>
      <img
        src={avatarUrl || "/src/assets/img/default-avatar.png"}
        alt="Avatar"
        className="profile-avatar__image"
      />
      <div className="profile-avatar__overlay">Change</div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="profile-avatar__input"
      />
    </div>
  );
}
