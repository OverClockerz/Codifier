
from datetime import datetime, timedelta
import time


def unix_overwrite(activeQuests):
    if activeQuests:
        for quest in activeQuests:
            raw_deadline = str(quest.get("deadline", "3"))
            days = int(''.join(filter(str.isdigit, raw_deadline)))
            quest["deadline"] = quest["deadline"] = int((datetime.fromtimestamp(time.time()) + timedelta(days=days)).timestamp())
    return activeQuests    

