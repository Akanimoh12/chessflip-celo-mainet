import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import type { Address } from 'viem';
import toast from 'react-hot-toast';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/components/atoms';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Icon } from '@/components/atoms/Icon';
import { chessFlipAbi } from '@/abi/chessFlip';
import { cn } from '@/utils/cn';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegistrationModal = ({
  isOpen,
  onClose,
  onSuccess,
}: RegistrationModalProps) => {
  const [username, setUsername] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const contractAddress = import.meta.env.VITE_CHESSFLIP_CONTRACT_ADDRESS as Address | undefined;

  const {
    data: hash,
    isPending: isWritePending,
    writeContract,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Client-side validation matching Solidity rules
  const validateUsername = (value: string): string | null => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 20) return 'Username cannot exceed 20 characters';
    
    // Match Solidity: alphanumeric + underscore only
    const validPattern = /^[a-zA-Z0-9_]+$/;
    if (!validPattern.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    
    return null;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setValidationError(value ? validateUsername(value) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateUsername(username);
    if (error) {
      setValidationError(error);
      toast.error(error);
      return;
    }

    if (!contractAddress) {
      toast.error('Contract address not configured');
      return;
    }

    try {
      writeContract({
        address: contractAddress,
        abi: chessFlipAbi,
        functionName: 'registerPlayer',
        args: [username],
      });

      toast.loading('Registering username...', { id: 'registration' });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register username');
    }
  };

  // Handle transaction success
  useEffect(() => {
    if (isSuccess) {
      toast.success(`Welcome, ${username}! 🎉`, { id: 'registration' });
      
      setTimeout(() => {
        setUsername('');
        setValidationError(null);
        onSuccess?.();
        onClose();
      }, 1500);
    }
  }, [isSuccess, username, onSuccess, onClose]);

  // Handle errors
  useEffect(() => {
    if (writeError) {
      const errorMessage = writeError.message.includes('UsernameTaken')
        ? 'Username already taken. Try another!'
        : 'Registration failed. Please try again.';
      
      toast.error(errorMessage, { id: 'registration' });
    }
  }, [writeError]);

  useEffect(() => {
    if (isConfirming) {
      toast.loading('Confirming transaction...', { id: 'registration' });
    }
  }, [isConfirming]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isWritePending && !isConfirming) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isWritePending, isConfirming, onClose]);

  if (!isOpen) return null;

  const isProcessing = isWritePending || isConfirming;
  const canSubmit = !validationError && username.length >= 3 && !isProcessing;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-40"
        onClick={() => !isProcessing && onClose()}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card
          variant="default"
          className={cn(
            'w-full max-w-md border-primary shadow-brutalist-lg',
            'animate-in fade-in-0 zoom-in-95 duration-300'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between border-b-3 border-primary">
            <CardTitle className="text-xl md:text-2xl">Register username</CardTitle>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className={cn(
                'p-2 rounded-brutalist border-2 border-primary',
                'hover:bg-accent transition-colors',
                isProcessing && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Close modal"
            >
              <Icon icon={X} size="md" variant="primary" />
            </button>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="p-3 bg-yellow-100 border-3 border-yellow-600 rounded-brutalist">
              <p className="text-sm font-bold text-yellow-700">
                ⚠️ MAINNET: This uses REAL cUSD on Celo Mainnet
              </p>
            </div>
            <p className="text-sm text-primary/70">
              Choose a unique username to start playing. This cannot be changed later.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-semibold text-primary">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="your_username"
                  disabled={isProcessing}
                  className={cn(validationError && 'border-red-500')}
                  maxLength={20}
                  autoComplete="off"
                  autoFocus
                />
                
                <div className="flex items-center justify-between text-xs text-primary/60">
                  <span>3-20 characters • Letters, numbers, underscore only</span>
                  <span>{username.length}/20</span>
                </div>

                {validationError && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <Icon icon={AlertCircle} size="sm" />
                    <span>{validationError}</span>
                  </div>
                )}

                {!validationError && username.length >= 3 && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Icon icon={CheckCircle2} size="sm" />
                    <span>Username looks good!</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="brand"
                  size="md"
                  disabled={!canSubmit}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Icon icon={Loader2} size="md" className="animate-spin" />
                      {isWritePending ? 'Confirm in wallet...' : 'Processing...'}
                    </>
                  ) : (
                    'Register username'
                  )}
                </Button>
              </div>
            </form>

            {hash && (
              <div className="text-xs text-primary/60 text-center pt-2 border-t-2 border-primary/20">
                <a
                  href={`https://celoscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand transition-colors underline"
                >
                  View transaction on CeloScan →
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

RegistrationModal.displayName = 'RegistrationModal';
