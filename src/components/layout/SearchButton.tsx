"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaSearch, FaTimes } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SearchButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
    setSearchTerm("")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchTerm)
    // Implement your search logic here
  }

  return (
    <div className="relative flex items-center">
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.form
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSearch}
            className="flex items-center"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pr-10 transition-all duration-300 ease-in-out focus:w-80"
                autoFocus
              />
            </motion.div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 h-10 w-10 rounded-full"
              onClick={handleCollapse}
            >
              <FaTimes className="h-5 w-5" />
              <span className="sr-only">Close search</span>
            </Button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ width: "auto" }}
            animate={{ width: 40 }}
            exit={{ width: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={handleExpand}
            >
              <FaSearch className="h-5 w-5" />
              <span className="sr-only">Search products</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

