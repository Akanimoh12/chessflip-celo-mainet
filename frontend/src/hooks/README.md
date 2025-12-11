# usePlayer Hook Documentation

Custom React hook for fetching and caching ChessFlip player data using wagmi + TanStack Query.

## Features

✅ **Automatic caching** - 30s stale time, 5min garbage collection  
✅ **Refetch on focus** - Fresh data when user returns to tab  
✅ **Computed properties** - Win rate, formatted points, claim availability  
✅ **Type-safe** - Full TypeScript support with `PlayerData` interface  
✅ **Error handling** - Graceful fallbacks and retry logic  

---

## Usage

```tsx
import { usePlayer } from '@/hooks/usePlayer';

function ProfileCard() {
  const {
    player,
    isLoading,
    isRegistered,
    hasUnclaimedPoints,
    unclaimedPointsFormatted,
    totalPointsFormatted,
    winRate,
    refetch,
  } = usePlayer();

  if (isLoading) return <Spinner />;
  if (!isRegistered) return <RegisterPrompt />;

  return (
    <Card>
      <h2>{player.username}</h2>
      <p>Total Points: {totalPointsFormatted}</p>
      <p>Win Rate: {winRate}%</p>
      
      {hasUnclaimedPoints && (
        <Button onClick={() => claimRewards()}>
          Claim {unclaimedPointsFormatted} points
        </Button>
      )}
      
      <Button onClick={refetch}>Refresh</Button>
    </Card>
  );
}
```

---

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `player` | `PlayerData \| undefined` | Raw player data from contract |
| `isLoading` | `boolean` | Loading state |
| `isError` | `boolean` | Error state |
| `error` | `Error \| null` | Error object if query failed |
| `isRegistered` | `boolean` | Whether player has registered username |
| `hasUnclaimedPoints` | `boolean` | Whether player has points to claim |
| `unclaimedPointsFormatted` | `string` | Formatted string (e.g., "1,250") |
| `totalPointsFormatted` | `string` | Formatted total points |
| `winRate` | `number` | Percentage (0-100) |
| `refetch` | `() => void` | Manual refetch function |

---

## PlayerData Interface

```typescript
interface PlayerData {
  username: string;
  totalPoints: bigint;
  totalGames: bigint;
  wins: bigint;
  losses: bigint;
  unclaimedPoints: bigint;
  registered: boolean;
}
```

---

## Configuration

The hook uses the following TanStack Query options:

- **staleTime**: 30 seconds (balance freshness vs RPC calls)
- **gcTime**: 5 minutes (cache retention when unmounted)
- **refetchOnWindowFocus**: `true` (update on tab focus)
- **retry**: 3 attempts (RPC reliability)
- **enabled**: Only when wallet connected + contract address exists

---

## Examples

### Show claim button only when points available

```tsx
const { hasUnclaimedPoints, unclaimedPointsFormatted } = usePlayer();

<Button disabled={!hasUnclaimedPoints}>
  {hasUnclaimedPoints 
    ? `Claim ${unclaimedPointsFormatted} points` 
    : 'No rewards yet'}
</Button>
```

### Display win rate badge

```tsx
const { winRate, player } = usePlayer();

<Badge variant={winRate >= 60 ? 'brand' : 'secondary'}>
  {winRate}% win rate ({player?.wins.toString()} wins)
</Badge>
```

### Refresh after transaction

```tsx
const { refetch } = usePlayer();
const { writeContract } = useWriteContract();

const handleClaim = async () => {
  await writeContract({
    address: contractAddress,
    abi: chessFlipAbi,
    functionName: 'claimPoints',
  });
  
  // Refresh player data after successful claim
  refetch();
};
```

---

## Notes

- Hook automatically disables when wallet not connected
- Returns `undefined` for player data when contract address missing
- Formatted strings use browser locale (e.g., "1,234" in US, "1.234" in DE)
- Win rate rounds to nearest integer percentage
