# Coalition Commitment Tracker NZ
Coalition Government Promise Tracker 2023-2026 between National, ACT, and NZ First.

The goal of this project is to give an easy-to-use and informative progress report on the Coalition Government. Individuals and groups should be able to use this tool to determine where to apply pressure on the government on specific issues of interest to them.

The hope is to maintain this tool through to the next election with regular updates to the data so that it can be used to inform and influence voters.

This project will require some deliberate bias in how the data is presented and judged. Decisions will be made from the perspective of those who want the government to succeed on its right-wing policy commitments.

## Features
Includes all commitments from the National-NZFirst and National-ACT coalition agreements. Duplicates have been removed and matters too subjective to judge progress on are excluded. Overlaps are marked as "NZ First, ACT" in the current dataset.

Several lobby groups have released commitments they support and are happy with. Those currently included.
* Family First
* Hobson's Pledge

Status tracking is done as a percentage from 0-100, with a negative value indicating failure. A value of 10% is given to commitments announces as being in progress and 100% to those completed.

## Take a look
There is a Github hosted build of the current project available: https://dieuwedeboer.github.io/coalition-tracker-nz/

## The data

Right now the data is simply exported from a Google Sheet to CSV, which is then encoded into a Javascript bundle.

The spreadsheet is publicly accessible and you can add comments or message me elsewhere to get it updated: https://docs.google.com/spreadsheets/d/16vWjqH_ZR0d_Dav-aQRl2zvOs7fdybLP6-Yr8dTCC_g/edit

## Todo
* Table sorting improvements and filtering.
* Split rows that have multiple (or a list) of action points.
* Include National’s pledge card, fiscal plan, tax plan, and its 100 point economic plan — without the exceptions and comprises from the NZ First and ACT agreements. Compromises or overlap are indicated by "X, National" as parties in the current dataset.
* Add more lobby groups who have released lists of policy they want implemented (or policy they want to oppose).
