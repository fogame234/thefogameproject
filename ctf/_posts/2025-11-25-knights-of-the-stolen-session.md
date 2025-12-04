---
layout: post
title: CTF:1 Knights of the Stolen Session
ctf: Flare.io
date: 2025-11-25
tags: 
 - Flare.io
 - OSINT
 - Git
 - CTF
 - Writeup
---

Flare.io is hosting multiple CTFs during December. They are releasing one each week for the next 6 weeks. Having a theme focused on DnD makes these type of capture the flags fun. 

With that, please enjoy my write-up.

Begin Your Journey: <https://github.com/swordnshield>  
Flag format: `flare{....}`

<img src="/.../assets/images/overview_github.jpg" alt="DeadBeef site" class="responsive-img">

---

## <span class="heading-color">The Journey Begins</span>

It began as any other day waiting for Flare to drop their first week of capture‑the‑flag (CTF) challenges. As soon as it appeared, we were presented with the prompt to *begin your journey*. Ready to dive in, I set off on an adventure that quickly sent me down a Python‑shaped rabbit hole.

---

## <span class="heading-color">Initial Recon</span>

Upon opening the GitHub repository, I was greeted with several files, but three immediately stood out:

- **`readme.md`** – description on how to use the `roll.py` script  
- **`roll-test-chat.txt`** – a chat transcript containing example interactions and expected behavior  
- **`roll.py`** – a Python script used to simulate d20 dice rolls

The `roll.py` script was straightforward: it implemented a d20 roll with optional parameters, including rolling multiple dice, modifying the roll, and applying a *disadvantage* attribute. The chat transcript hinted at expected interactions, giving clues about how the script is “meant” to be used. Based on this, my initial assumption was that the challenge involved manipulating or predicting dice rolls based on seeded randomness.

I began by analyzing the files carefully to gather as much information as possible.

In the commit where `roll-test-chat.txt` was added, the commit message read:

 ```
 logs of the great IRC
 ```

Looking further at the GitHub page, I noticed the starred repositories of the author. One that stood out was **ExifTool**, but since we were dealing strictly with Python scripts and dice rolls—not images or metadata—I dismissed it as irrelevant.

```
[ #knights-of-the-stolen-session-dice-lounge ]
swordnshield: alright nerds the roll script is live and I want to test it out. type !roll xdY+Z and try not to break it in the first five minutes like last time
ratpaladin: "not to break it" bro it fell apart last time because you coded it
bard_ofbytes: he wrote that thing like a 4-year-old
artemisafk: both of you shut up, I’m trying to eat noodles and deride you simultaneously
hexgobl1n: ok seriously shut your goblins I roll initiative
hexgobl1n: !roll 1d20+3
 swordnshield (roll-bot): → 1d20 (4) + 3 = 7
ratpaladin: LMAOOOOOO
artemisafk: bro rolled a SEVEN. you couldn’t initiative your way out of a wet paper bag
hexgobl1n: I hope your router catches on fire
bard_ofbytes: anyway, welcome to our campaign, "Knights of the Stolen Session"
ratpaladin: bro that sounds like we’re LARPing as PAM interns
hexgobl1n: ngl that’s actually the vibe
artemisafk: ok I cast perception before Rat does something stupid again
 !roll 1d20+1
 roll-bot: → 1d20 (2) + 1 = 3
bard_ofbytes: LMFAOOOOOOO
ratpaladin: 3?? bro you didn’t PERCEIVE THE FLOOR
hexgobl1n: someone turn on ray tracing for this guy
artemisafk: god I hope your next burrito gives you food poisoning fr
```
---

## <span class="heading-color">Attempt 1 – Seed Bruteforcing & Pattern Extraction</span>

I didn’t initially care about the dice results themselves, but something in the chat log tipped me off:  
the math didn’t match the behavior in the actual **`roll.py`** script.

This pushed me toward investigating the seeds directly.

I noticed in the script that you could specify a seed using the argument **`--seed`**. This meant reproducibility was possible—and guessing or brute‑forcing the correct seed might reveal the flag. I wrote a Python script to iterate through seeds **1–10,000**, checking the output for the keyword **'flare'**.

At first, I tested single‑dice rolls. But revisiting the chat logs, I noticed that the participants specifically used **disadvantage**, which meant multiple dice were rolled. Returning to **`roll.py`**, I confirmed the expected flag path was likely hidden behind **`--dis`** argument to simulate multiple dice being rolled at the same time. 

I updated the script to reflect my arguments:

```python
cmd = ["python", "roll.py", "-n", str(num_rolls), "--dis", "--format", "json"]
```

This would givem a string like below 

```
Seed 421: 30 chars -> FLARELTIHDRGCPQSSCKSNBBJCHEFGJLMQTQ
```

This immediately caught my attention **'flare'** + random characters matched the structure of a plausible encoded flag.

For each candidate seed, I modified the script so it would:

1. Generate output and scan the first ~30 characters for the string **“flare”**.  
2. Extract the subsequent 30 characters, treating this as a potential encoded flag fragment.  
3. Apply slicing operations on the extracted string:  
   - `s[::2]` (every second character)  
   - `s[::3]` (every third character)  
4. Run Caesar Cipher shifts on the slices:  
   - `+7` shift for `s[::2]`  
   - `+19` shift for `s[::3]`

This decoding pipeline produced a variety of meaningful‑looking strings. Among the results, I extracted artifacts such as:

- `FLAG_FOUND`
- `unseen_parse`
- `unknown_injection`

Naturally, I attempted to submit **FLAG_FOUND**, but the system wouldn't allow me to pass. I let the brute‑forcer run overnight, generating dozens of “valid‑looking” but ultimately incorrect strings.

By morning, I had nothing but noise. No correct flag. No clear path forward. At this point, with the deadline closing in, Attempt 1 was officially a dead end.

---

## <span class="heading-color">Starting Over</span>

After a disappointing night of false positives, I started fresh in the morning. While reviewing everything again, it suddenly occurred to me that I never checked the actual git log history. This was a major oof moment. 

Working with my counterpart Lothos, we cloned the git repo locally and dug into the commit history. We quickly discovered that the **Git repository itself contained hidden artifacts** left behind in previous commits that nevre appeared in the working tree. 

Commands used:

> git log
> git log -p

<img src="/.../assets/images/gitlog.jpg" alt="Git Log" class="responsive-img">

There was a commit by a user whose domain was an actual site. 

> Site: bobshomepage.net

Visiting the site showed that some text stating that it was discontinued. Fuzzing the URL I was able to determine that there was a `/robots.txt`. 

```
User-agent: *
Disallow: /sealed-chamber-deadbeef.html
```

Routing to the site that was listed as disallowed, it presented another page that only had an image of a d20 and a quote stating that "A picture is worth 1,000 words."

<img src="/.../assets/images/deadbeef.jpg" alt="DeadBeef site" class="medium-responsive-img">

Remembering that the original github repository also starred a ExifTool repo, I ran ExifTool on the d20 image which revealed the flag under the attribute **User Comment**

```
Flag: flare{0s1nt_m4st3r_749261}
```
