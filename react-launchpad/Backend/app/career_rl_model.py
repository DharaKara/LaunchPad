"""
Career Path RL Model — Q-Learning (Offline / Batch)
=====================================================
Trains a Q-learning agent on the career_mdp_dataset.csv file.

States:
  0 = Beginner
  1 = Student
  2 = Junior_Skilled
  3 = Intern
  4 = Professional

Actions:
  0 = Enroll_Degree
  1 = Self_Study_Tech
  2 = Soft_Skills
  3 = Apply_For_Job

Rewards:
  +100  Internship → job success (Intern + Apply_For_Job)
  +25   Junior_Skilled applies for job
  +20   Student self-studies → progresses
  +15   Beginner enrolls in degree
  +10   Intern builds soft skills
  +5    Minor positive progress
  -5    Inefficient behaviour
  -50   Premature job application
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os

# ── Configuration ────────────────────────────────────────────────────────────

DATASET_PATH = "career_mdp_dataset.csv"   # update path if needed

N_STATES   = 5
N_ACTIONS  = 4
ALPHA      = 0.3    # learning rate
GAMMA      = 0.9    # discount factor
EPOCHS     = 500    # passes over the dataset

STATE_NAMES  = ["Beginner", "Student", "Junior_Skilled", "Intern", "Professional"]
ACTION_NAMES = ["Enroll_Degree", "Self_Study_Tech", "Soft_Skills", "Apply_For_Job"]

# ── Load dataset ─────────────────────────────────────────────────────────────

def load_dataset(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    df.columns = df.columns.str.strip()
    expected = {"current_state", "action", "next_state", "reward"}
    assert expected.issubset(df.columns), f"Missing columns. Found: {df.columns.tolist()}"
    print(f"Loaded {len(df):,} transitions from '{path}'")
    return df

# ── Q-Learning (offline / batch) ─────────────────────────────────────────────

def train_q_table(df: pd.DataFrame) -> tuple[np.ndarray, list[float]]:
    Q = np.zeros((N_STATES, N_ACTIONS))
    epoch_rewards = []

    for epoch in range(EPOCHS):
        total_reward = 0.0
        for _, row in df.iterrows():
            s  = int(row["current_state"])
            a  = int(row["action"])
            ns = int(row["next_state"])
            r  = float(row["reward"])

            best_next = np.max(Q[ns])
            Q[s, a] += ALPHA * (r + GAMMA * best_next - Q[s, a])
            total_reward += r

        epoch_rewards.append(total_reward)

        if (epoch + 1) % 100 == 0:
            print(f"  Epoch {epoch + 1}/{EPOCHS} — cumulative reward: {total_reward:.1f}")

    return Q, epoch_rewards

# ── Policy extraction ────────────────────────────────────────────────────────

def extract_policy(Q: np.ndarray) -> np.ndarray:
    return np.argmax(Q, axis=1)

def print_policy(policy: np.ndarray) -> None:
    print("\n─── Learned Policy ───────────────────────────────")
    for s, a in enumerate(policy):
        print(f"  {STATE_NAMES[s]:<20} →  {ACTION_NAMES[a]}")
    print("──────────────────────────────────────────────────\n")

def print_q_table(Q: np.ndarray) -> None:
    header = f"{'State':<20}" + "".join(f"{a:<18}" for a in ACTION_NAMES)
    print("\n─── Q-Table ───────────────────────────────────────────────────────────────")
    print(header)
    print("─" * len(header))
    for s in range(N_STATES):
        row_str = f"{STATE_NAMES[s]:<20}" + "".join(f"{Q[s, a]:<18.2f}" for a in range(N_ACTIONS))
        best = np.argmax(Q[s])
        print(row_str + f"  ← {ACTION_NAMES[best]}")
    print("───────────────────────────────────────────────────────────────────────────\n")

# ── Agent simulation ──────────────────────────────────────────────────────────

def simulate_agent(
    policy: np.ndarray,
    df: pd.DataFrame,
    start_state: int = 0,
    max_steps: int = 10,
) -> None:
    """Walk through career states using the learned policy."""
    print("─── Agent Simulation ─────────────────────────────")
    state = start_state
    total_reward = 0.0

    for step in range(1, max_steps + 1):
        action = policy[state]

        # sample a real transition from the dataset
        matches = df[(df["current_state"] == state) & (df["action"] == action)]
        if matches.empty:
            print(f"  Step {step}: No transition data for state={STATE_NAMES[state]}, "
                  f"action={ACTION_NAMES[action]}. Stopping.")
            break

        row = matches.sample(1).iloc[0]
        next_state = int(row["next_state"])
        reward     = float(row["reward"])
        total_reward += reward

        reward_str = f"+{reward:.0f}" if reward >= 0 else f"{reward:.0f}"
        print(f"  Step {step}: {STATE_NAMES[state]:<20} → {ACTION_NAMES[action]:<18} "
              f"→ {STATE_NAMES[next_state]:<20}  reward={reward_str}")

        if next_state == 4:   # reached Professional
            print(f"\n  Goal reached — Professional! Total reward: {total_reward:.0f}")
            break

        state = next_state
    else:
        print(f"\n  Simulation ended. Total reward: {total_reward:.0f}")

    print("──────────────────────────────────────────────────\n")

# ── Visualisation ─────────────────────────────────────────────────────────────

def plot_rewards(epoch_rewards: list[float], save_path: str = "reward_curve.png") -> None:
    plt.figure(figsize=(9, 4))
    plt.plot(range(1, len(epoch_rewards) + 1), epoch_rewards, color="#378ADD", linewidth=1.5)
    plt.xlabel("Epoch")
    plt.ylabel("Cumulative reward")
    plt.title("Q-Learning — reward over training epochs")
    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    plt.close()
    print(f"Reward curve saved → {save_path}")

def plot_q_heatmap(Q: np.ndarray, save_path: str = "q_table_heatmap.png") -> None:
    fig, ax = plt.subplots(figsize=(8, 4))
    im = ax.imshow(Q, cmap="YlGn", aspect="auto")
    ax.set_xticks(range(N_ACTIONS))
    ax.set_xticklabels(ACTION_NAMES, rotation=25, ha="right", fontsize=9)
    ax.set_yticks(range(N_STATES))
    ax.set_yticklabels(STATE_NAMES, fontsize=9)
    for i in range(N_STATES):
        for j in range(N_ACTIONS):
            ax.text(j, i, f"{Q[i, j]:.1f}", ha="center", va="center", fontsize=8,
                    color="black" if Q[i, j] < Q.max() * 0.7 else "white")
    plt.colorbar(im, ax=ax, label="Q-value")
    ax.set_title("Q-Table Heatmap")
    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    plt.close()
    print(f"Q-table heatmap saved → {save_path}")

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("\n=== Career Path RL — Q-Learning ===\n")

    # 1. Load data
    df = load_dataset(DATASET_PATH)

    # 2. Train
    print(f"\nTraining Q-table ({EPOCHS} epochs, α={ALPHA}, γ={GAMMA}) …")
    Q, epoch_rewards = train_q_table(df)

    # 3. Results
    print_q_table(Q)
    policy = extract_policy(Q)
    print_policy(policy)

    # 4. Simulate
    simulate_agent(policy, df)

    # 5. Plots
    plot_rewards(epoch_rewards)
    plot_q_heatmap(Q)

    # 6. Save Q-table
    q_df = pd.DataFrame(Q, index=STATE_NAMES, columns=ACTION_NAMES)
    q_df.to_csv("q_table.csv")
    print("Q-table saved → q_table.csv")

    print("\nDone.\n")


if __name__ == "__main__":
    main()
