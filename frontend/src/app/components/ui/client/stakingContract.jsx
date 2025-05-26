import React, { useState, useEffect } from "react";
import { formatUnits, parseUnits } from "ethers";
import { toast } from "sonner";
import { Text, Button, Input, Divider, LoadingDots } from "../common";
import {
  getBalanceOf,
  getStakingPeriod,
  getTokenEarned,
  getFinishTime,
  getRewardRate,
  getTotalSupply,
  getStakingToken,
  getRewardsToken,
  stakeTokens,
  withdrawTokens,
  getReward,
} from "../../../services/stakingService.js";

export const StakingContract = ({
  isConfirmed,
  address,
  publicClient,
  writeContract,
  isFailed,
  writeError,
}) => {
  // States for storing data
  const [stakedBalance, setStakedBalance] = useState("");
  const [stakingPeriod, setStakingPeriod] = useState("");
  const [earnedTokens, setEarnedTokens] = useState("");
  const [finishTime, setFinishTime] = useState("");
  const [rewardRate, setRewardRate] = useState("");
  const [totalStaked, setTotalStaked] = useState("");
  const [stakingTokenAddress, setStakingTokenAddress] = useState("");
  const [rewardsTokenAddress, setRewardsTokenAddress] = useState("");

  // Input states
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isStaking, setIsStaking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  const fetchStakingData = async () => {
    if (!publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      // User staked balance
      if (address) {
        const balance = await getBalanceOf(publicClient, address);
        if (balance) {
          setStakedBalance(balance);
        }
      }

      // Staking period
      const period = await getStakingPeriod(publicClient);
      if (period) {
        // Convert from seconds to days
        const periodInDays = Math.floor(Number(period) / (24 * 60 * 60));
        setStakingPeriod(periodInDays.toString());
      }

      // Earned tokens
      if (address) {
        const earned = await getTokenEarned(publicClient, address);
        if (earned) {
          setEarnedTokens(earned);
        }
      }

      // Finish time
      const finish = await getFinishTime(publicClient);
      if (finish) {
        const date = new Date(Number(finish) * 1000);
        setFinishTime(date.toLocaleString());
      }

      // Reward rate
      const rate = await getRewardRate(publicClient);
      if (rate) {
        setRewardRate(rate);
      }

      // Total staked
      const total = await getTotalSupply(publicClient);
      if (total) {
        setTotalStaked(total);
      }

      // Staking token address
      const stakingToken = await getStakingToken(publicClient);
      if (stakingToken) {
        setStakingTokenAddress(stakingToken);
      }

      // Rewards token address
      const rewardsToken = await getRewardsToken(publicClient);
      if (rewardsToken) {
        setRewardsTokenAddress(rewardsToken);
      }
    } catch (err) {
      console.error("Error fetching staking data: ", err);
      setError("Error fetching staking data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchStakingData();
  }, [publicClient, address]);

  // Refetch data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      fetchStakingData();

      // Reset states
      setIsStaking(false);
      setIsWithdrawing(false);
      setIsClaiming(false);
      setStakeAmount("");
      setWithdrawAmount("");
    }
  }, [isConfirmed]);

  // Handle transaction errors
  useEffect(() => {
    if (isFailed || writeError) {
      toast.error("Transaction failed. Please try again.");

      // Reset states
      setIsStaking(false);
      setIsWithdrawing(false);
      setIsClaiming(false);
    }
  }, [isFailed, writeError]);

  const handleStake = async () => {
    if (!stakeAmount || !writeContract) return;

    try {
      setError(null);
      setIsStaking(true);

      const amountWei = parseUnits(stakeAmount, 18); // Assuming 18 decimals, adjust if needed
      await stakeTokens(writeContract, amountWei);

      toast.success("Staking transaction submitted!");
    } catch (err) {
      console.error("Error staking tokens: ", err);
      setError("Error staking tokens. Please try again.");
      setIsStaking(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !writeContract) return;

    try {
      setError(null);
      setIsWithdrawing(true);

      const amountWei = parseUnits(withdrawAmount, 18); // Assuming 18 decimals, adjust if needed
      await withdrawTokens(writeContract, amountWei);

      toast.success("Withdrawal transaction submitted!");
    } catch (err) {
      console.error("Error withdrawing tokens: ", err);
      setError("Error withdrawing tokens. Please try again.");
      setIsWithdrawing(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!writeContract) return;

    try {
      setError(null);
      setIsClaiming(true);

      await getReward(writeContract);

      toast.success("Claim rewards transaction submitted!");
    } catch (err) {
      console.error("Error claiming rewards: ", err);
      setError("Error claiming rewards. Please try again.");
      setIsClaiming(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "-";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTokenAmount = (amount) => {
    if (!amount) return "0";
    try {
      return formatUnits(amount, 18); // Assuming 18 decimals, adjust if needed
    } catch (err) {
      console.error("Error formatting token amount: ", err);
      return "0";
    }
  };

  return (
    <div className="w-full h-full">
      {isLoading ? (
        // Loading state
        <div className="w-full h-32 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoadingDots width="w-4" height="h-4" />
            <Text variant="extraSmall" color="secondary" className="uppercase">
              Loading staking data...
            </Text>
          </div>
        </div>
      ) : (
        // Staking Contract Section
        <div className="w-full flex flex-col items-start justify-start px-5 gap-4">
          {/* Staking Info Section */}
          <div className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <Text variant="h4" weight="semibold" className="mb-4">
              Staking Information
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Your Staked Balance
                </Text>
                <Text variant="body" weight="medium">
                  {formatTokenAmount(stakedBalance)} Tokens
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Earned Rewards
                </Text>
                <Text variant="body" weight="medium">
                  {formatTokenAmount(earnedTokens)} Tokens
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Total Staked
                </Text>
                <Text variant="body" weight="medium">
                  {formatTokenAmount(totalStaked)} Tokens
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Staking Period
                </Text>
                <Text variant="body" weight="medium">
                  {stakingPeriod || "-"} Days
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Reward Rate
                </Text>
                <Text variant="body" weight="medium">
                  {formatTokenAmount(rewardRate)} Tokens/sec
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Rewards End Date
                </Text>
                <Text variant="body" weight="medium">
                  {finishTime || "-"}
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Staking Token
                </Text>
                <Text variant="body" weight="medium">
                  {formatAddress(stakingTokenAddress)}
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Rewards Token
                </Text>
                <Text variant="body" weight="medium">
                  {formatAddress(rewardsTokenAddress)}
                </Text>
              </div>
            </div>
          </div>

          <Divider className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2" />

          {/* Staking Actions Section */}
          <div className="w-full">
            <Text variant="h4" weight="semibold" className="mb-4">
              Staking Actions
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stake Tokens */}
              <div className="flex flex-col gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <Text variant="h5" weight="medium">
                  Stake Tokens
                </Text>
                <Input
                  type="text"
                  placeholder="Amount to stake"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                />
                <Button
                  variant="default"
                  onClick={handleStake}
                  disabled={!stakeAmount || isStaking || !address}
                  className="w-full"
                >
                  {isStaking ? "Staking..." : "Stake Tokens"}
                </Button>
              </div>

              {/* Withdraw Tokens */}
              <div className="flex flex-col gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <Text variant="h5" weight="medium">
                  Withdraw Tokens
                </Text>
                <Input
                  type="text"
                  placeholder="Amount to withdraw"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <Button
                  variant="default"
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || isWithdrawing || !address}
                  className="w-full"
                >
                  {isWithdrawing ? "Withdrawing..." : "Withdraw Tokens"}
                </Button>
              </div>

              {/* Claim Rewards */}
              <div className="flex flex-col gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:col-span-2">
                <div className="flex flex-row justify-between items-center">
                  <Text variant="h5" weight="medium">
                    Claim Rewards
                  </Text>
                  <Text variant="body">
                    Available: {formatTokenAmount(earnedTokens)} Tokens
                  </Text>
                </div>
                <Button
                  variant="default"
                  onClick={handleClaimRewards}
                  disabled={
                    !earnedTokens ||
                    Number(earnedTokens) <= 0 ||
                    isClaiming ||
                    !address
                  }
                  className="w-full"
                >
                  {isClaiming ? "Claiming..." : "Claim Rewards"}
                </Button>
              </div>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="w-full p-3 bg-red-100 dark:bg-red-900/30 rounded-lg mt-4">
              <Text variant="body" color="error" align="center">
                {error}
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StakingContract;
