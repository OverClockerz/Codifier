from datetime import datetime

def calculate_paid_leaves(player: dict) -> dict:
    last_login = player.get("lastLoginDate")
    if not last_login:
        return player  # no login date, nothing to update

    current_date = datetime.now(last_login.tzinfo)
    delta_days = (current_date - last_login).days

    paid_leaves = player.get("paidLeaves", 0)

    if delta_days > paid_leaves:
        # Days exceeded paid leaves → penalties
        excess_days = delta_days - paid_leaves
        player["currentMonthEarnings"] = player.get("currentMonthEarnings", 0) - (20 * excess_days)
        player["reputation"] = player.get("reputation", 0) - (1.5 * excess_days)
        player["paidLeaves"] = 0  # all consumed
    else:
        # Within paid leaves → consume them and adjust mood/stress
        player["paidLeaves"] = paid_leaves - delta_days
        # Example adjustments: tweak as needed
    player["mood"] = min(player.get("mood", 50) + (20 * delta_days), 100)
    player["stress"] = max(0, player.get("stress", 50) - (30 * delta_days))

    return player