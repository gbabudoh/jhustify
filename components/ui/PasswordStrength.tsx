'use client';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety checks
    if (/[a-z]/.test(password)) score++; // lowercase
    if (/[A-Z]/.test(password)) score++; // uppercase
    if (/[0-9]/.test(password)) score++; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score++; // special characters

    // Return strength based on score
    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 5) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrength();

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              level <= strength.score ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        strength.score === 1 ? 'text-red-600' :
        strength.score === 2 ? 'text-yellow-600' :
        strength.score === 3 ? 'text-blue-600' :
        'text-green-600'
      }`}>
        Password strength: {strength.label}
      </p>
      {strength.score < 3 && (
        <div className="mt-2 text-xs text-gray-600">
          <p className="font-medium mb-1">Tips for a stronger password:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {password.length < 8 && <li>Use at least 8 characters</li>}
            {!/[A-Z]/.test(password) && <li>Include uppercase letters</li>}
            {!/[a-z]/.test(password) && <li>Include lowercase letters</li>}
            {!/[0-9]/.test(password) && <li>Include numbers</li>}
            {!/[^a-zA-Z0-9]/.test(password) && <li>Include special characters (!@#$%^&*)</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
