import tkinter as tk
from tkinter import font
import time

class TransparentClock(tk.Tk):
    def __init__(self):
        super().__init__()

        # Set window properties
        self.overrideredirect(True)  # Remove window decorations
        self.attributes('-topmost', True)  # Always on top
        self.attributes('-alpha', 0.7)  # Set transparency (0.0 to 1.0)
        self.geometry("200x150")  # Set the size of the window

        # Create a label to display the current time
        self.clock_label = tk.Label(self, font=font.Font(size=40), bg='black', fg='white')
        self.clock_label.pack(expand=True, fill='both')

        # Create a label to display the timer
        self.timer_label = tk.Label(self, font=font.Font(size=30), bg='black', fg='green')
        self.timer_label.pack(expand=True, fill='both')

        # Initialize timer variables
        self.start_time = time.time()
        self.update_clock()
        self.update_timer()

    def update_clock(self):
        current_time = time.strftime('%H:%M:%S')  # Get current time
        self.clock_label.config(text=current_time)  # Update clock label text
        self.after(1000, self.update_clock)  # Call this method again after 1 second

    def update_timer(self):
        elapsed_time = int(time.time() - self.start_time)  # Calculate elapsed time
        minutes, seconds = divmod(elapsed_time, 60)  # Convert to minutes and seconds
        timer_text = f'{minutes:02}:{seconds:02}'  # Format timer text
        self.timer_label.config(text=timer_text)  # Update timer label text
        self.after(1000, self.update_timer)  # Call this method again after 1 second

if __name__ == "__main__":
    clock = TransparentClock()
    clock.mainloop()
