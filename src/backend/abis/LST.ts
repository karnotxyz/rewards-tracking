export const ABI = [
  {
    "name": "MyERC4626Impl",
    "type": "impl",
    "interface_name": "lst::lst::interface::IERC4626"
  },
  {
    "name": "core::integer::u256",
    "type": "struct",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "name": "lst::lst::interface::IERC4626",
    "type": "interface",
    "items": [
      {
        "name": "asset",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "total_assets",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "convert_to_shares",
        "type": "function",
        "inputs": [
          {
            "name": "assets",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "convert_to_assets",
        "type": "function",
        "inputs": [
          {
            "name": "shares",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "max_deposit",
        "type": "function",
        "inputs": [
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "preview_deposit",
        "type": "function",
        "inputs": [
          {
            "name": "assets",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "deposit",
        "type": "function",
        "inputs": [
          {
            "name": "assets",
            "type": "core::integer::u256"
          },
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "max_mint",
        "type": "function",
        "inputs": [
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "preview_mint",
        "type": "function",
        "inputs": [
          {
            "name": "shares",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "mint",
        "type": "function",
        "inputs": [
          {
            "name": "shares",
            "type": "core::integer::u256"
          },
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "max_withdraw",
        "type": "function",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "preview_withdraw",
        "type": "function",
        "inputs": [
          {
            "name": "assets",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "withdraw",
        "type": "function",
        "inputs": [
          {
            "name": "assets",
            "type": "core::integer::u256"
          },
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "max_redeem",
        "type": "function",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "preview_redeem",
        "type": "function",
        "inputs": [
          {
            "name": "shares",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "redeem",
        "type": "function",
        "inputs": [
          {
            "name": "shares",
            "type": "core::integer::u256"
          },
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "LSTAdditionalImpl",
    "type": "impl",
    "interface_name": "lst::lst::interface::ILSTAdditional"
  },
  {
    "name": "core::byte_array::ByteArray",
    "type": "struct",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "name": "lst::withdrawal_queue::interface::IWithdrawalQueueDispatcher",
    "type": "struct",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "name": "contracts::staking::interface::IStakingDispatcher",
    "type": "struct",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "name": "lst::lst::interface::Config",
    "type": "struct",
    "members": [
      {
        "name": "deposit_fee_bps",
        "type": "core::integer::u256"
      },
      {
        "name": "withdraw_fee_bps",
        "type": "core::integer::u256"
      },
      {
        "name": "rewards_fee_bps",
        "type": "core::integer::u256"
      },
      {
        "name": "treasury",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "withdraw_queue",
        "type": "lst::withdrawal_queue::interface::IWithdrawalQueueDispatcher"
      },
      {
        "name": "staker",
        "type": "contracts::staking::interface::IStakingDispatcher"
      },
      {
        "name": "validator",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "name": "core::bool",
    "type": "enum",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "name": "lst::lst::interface::DelegatorInfo",
    "type": "struct",
    "members": [
      {
        "name": "is_active",
        "type": "core::bool"
      },
      {
        "name": "delegator_index",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "name": "lst::lst::interface::ILSTAdditional",
    "type": "interface",
    "items": [
      {
        "name": "initializer",
        "type": "function",
        "inputs": [
          {
            "name": "calldata",
            "type": "core::array::Array::<core::felt252>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "deposit_with_referral",
        "type": "function",
        "inputs": [
          {
            "name": "assets",
            "type": "core::integer::u256"
          },
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "referral",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "set_config",
        "type": "function",
        "inputs": [
          {
            "name": "config",
            "type": "lst::lst::interface::Config"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "get_config",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "lst::lst::interface::Config"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "stake",
        "type": "function",
        "inputs": [
          {
            "name": "delegator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "send_to_withdraw_queue",
        "type": "function",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "before_unstake",
        "type": "function",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "add_delegator",
        "type": "function",
        "inputs": [
          {
            "name": "delegator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "update_delegator_info",
        "type": "function",
        "inputs": [
          {
            "name": "delegator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "info",
            "type": "lst::lst::interface::DelegatorInfo"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "is_delegator",
        "type": "function",
        "inputs": [
          {
            "name": "delegator",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "claim_rewards",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "CommonCompImpl",
    "type": "impl",
    "interface_name": "lst::utils::common::ICommon"
  },
  {
    "name": "lst::utils::common::ICommon",
    "type": "interface",
    "items": [
      {
        "name": "upgrade",
        "type": "function",
        "inputs": [
          {
            "name": "new_class",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "pause",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "unpause",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "is_paused",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "owner",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transfer_ownership",
        "type": "function",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounce_ownership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "AccessControlImpl",
    "type": "impl",
    "interface_name": "openzeppelin_access::accesscontrol::interface::IAccessControl"
  },
  {
    "name": "openzeppelin_access::accesscontrol::interface::IAccessControl",
    "type": "interface",
    "items": [
      {
        "name": "has_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_role_admin",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "grant_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "revoke_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounce_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "ERC4626MetadataImpl",
    "type": "impl",
    "interface_name": "openzeppelin_token::erc20::interface::IERC20Metadata"
  },
  {
    "name": "openzeppelin_token::erc20::interface::IERC20Metadata",
    "type": "interface",
    "items": [
      {
        "name": "name",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "symbol",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "decimals",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u8"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "name": "ERC20Impl",
    "type": "impl",
    "interface_name": "openzeppelin_token::erc20::interface::IERC20"
  },
  {
    "name": "openzeppelin_token::erc20::interface::IERC20",
    "type": "interface",
    "items": [
      {
        "name": "total_supply",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "balance_of",
        "type": "function",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "allowance",
        "type": "function",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "spender",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transfer",
        "type": "function",
        "inputs": [
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "transfer_from",
        "type": "function",
        "inputs": [
          {
            "name": "sender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "approve",
        "type": "function",
        "inputs": [
          {
            "name": "spender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "ERC20CamelOnlyImpl",
    "type": "impl",
    "interface_name": "openzeppelin_token::erc20::interface::IERC20CamelOnly"
  },
  {
    "name": "openzeppelin_token::erc20::interface::IERC20CamelOnly",
    "type": "interface",
    "items": [
      {
        "name": "totalSupply",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "balanceOf",
        "type": "function",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transferFrom",
        "type": "function",
        "inputs": [
          {
            "name": "sender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "name",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "symbol",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "asset",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "config",
        "type": "lst::lst::interface::Config"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Upgraded",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_security::pausable::PausableComponent::Paused",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_security::pausable::PausableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Paused",
        "type": "openzeppelin_security::pausable::PausableComponent::Paused"
      },
      {
        "kind": "nested",
        "name": "Unpaused",
        "type": "openzeppelin_security::pausable::PausableComponent::Unpaused"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred"
      },
      {
        "kind": "nested",
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "lst::utils::common::CommonComp::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "struct",
    "name": "lst::lst::erc4626::ERC4626Component::Deposit",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "assets",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "shares",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "lst::lst::erc4626::ERC4626Component::Withdraw",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "receiver",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "assets",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "shares",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "lst::lst::erc4626::ERC4626Component::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Deposit",
        "type": "lst::lst::erc4626::ERC4626Component::Deposit"
      },
      {
        "kind": "nested",
        "name": "Withdraw",
        "type": "lst::lst::erc4626::ERC4626Component::Withdraw"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_token::erc20::erc20::ERC20Component::Transfer",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "value",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_token::erc20::erc20::ERC20Component::Approval",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "value",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_token::erc20::erc20::ERC20Component::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Transfer",
        "type": "openzeppelin_token::erc20::erc20::ERC20Component::Transfer"
      },
      {
        "kind": "nested",
        "name": "Approval",
        "type": "openzeppelin_token::erc20::erc20::ERC20Component::Approval"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "lst::utils::access_control::MyAccessControlComp::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "previous_admin_role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "new_admin_role",
        "type": "core::felt252"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "RoleGranted",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted"
      },
      {
        "kind": "nested",
        "name": "RoleRevoked",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked"
      },
      {
        "kind": "nested",
        "name": "RoleAdminChanged",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_introspection::src5::SRC5Component::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "struct",
    "name": "lst::lst::interface::DispatchToStake",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "delegator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "lst::lst::interface::DispatchToWithdrawQueue",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "lst::lst::lst::LST::DelegatorUpdate",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "delegator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "info",
        "type": "lst::lst::interface::DelegatorInfo"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "lst::lst::interface::Fee",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      },
      {
        "kind": "key",
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "receiver",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "lst::lst::lst::LST::Referral",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "referrer",
        "type": "core::byte_array::ByteArray"
      },
      {
        "kind": "key",
        "name": "referee",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "assets",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "lst::lst::lst::LST::Event",
    "type": "event",
    "variants": [
      {
        "kind": "flat",
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "PausableEvent",
        "type": "openzeppelin_security::pausable::PausableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "ReentrancyGuardEvent",
        "type": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event"
      },
      {
        "kind": "flat",
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "CommonCompEvent",
        "type": "lst::utils::common::CommonComp::Event"
      },
      {
        "kind": "flat",
        "name": "ERC4626Event",
        "type": "lst::lst::erc4626::ERC4626Component::Event"
      },
      {
        "kind": "flat",
        "name": "ERC20Event",
        "type": "openzeppelin_token::erc20::erc20::ERC20Component::Event"
      },
      {
        "kind": "flat",
        "name": "MyAccessControlCompEvent",
        "type": "lst::utils::access_control::MyAccessControlComp::Event"
      },
      {
        "kind": "flat",
        "name": "AccessControlComponentEvent",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event"
      },
      {
        "kind": "flat",
        "name": "SRC5Event",
        "type": "openzeppelin_introspection::src5::SRC5Component::Event"
      },
      {
        "kind": "nested",
        "name": "DispatchToStake",
        "type": "lst::lst::interface::DispatchToStake"
      },
      {
        "kind": "nested",
        "name": "DispatchToWithdrawQueue",
        "type": "lst::lst::interface::DispatchToWithdrawQueue"
      },
      {
        "kind": "nested",
        "name": "DelegatorUpdate",
        "type": "lst::lst::lst::LST::DelegatorUpdate"
      },
      {
        "kind": "nested",
        "name": "Fee",
        "type": "lst::lst::interface::Fee"
      },
      {
        "kind": "nested",
        "name": "Referral",
        "type": "lst::lst::lst::LST::Referral"
      }
    ]
  }
] as const;